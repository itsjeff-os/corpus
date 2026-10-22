import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { arrayBufferToBase64, PcmPlayer } from "./audio";

type SessionState =
  | "idle"
  | "permission"
  | "connecting"
  | "listening"
  | "user_speaking"
  | "thinking"
  | "assistant_speaking"
  | "reconnecting"
  | "error";

type Turn = {
  id: string;
  role: "user" | "assistant";
  text: string;
  final: boolean;
};

type RealtimeEvent = {
  type: string;
  item_id?: string;
  response_id?: string;
  delta?: string;
  transcript?: string;
  message?: string;
  recoverable?: boolean;
  error?: { message?: string };
};

const labels: Record<SessionState, string> = {
  idle: "Off duty",
  permission: "Requesting the room",
  connecting: "Calling the concierge",
  listening: "Listening",
  user_speaking: "You have the floor",
  thinking: "Plotting beautifully",
  assistant_speaking: "Concierge is speaking",
  reconnecting: "Restoring the line",
  error: "Line interrupted",
};

function upsertTurn(turns: Turn[], next: Turn) {
  const index = turns.findIndex((turn) => turn.id === next.id);
  if (index === -1) return [...turns, next];
  const copy = [...turns];
  copy[index] = next;
  return copy;
}

function getSocketUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/realtime`;
}

export default function App() {
  const [status, setStatus] = useState<SessionState>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [micMuted, setMicMuted] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [level, setLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [modelLabel, setModelLabel] = useState("Realtime model");

  const socketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const playerRef = useRef<PcmPlayer | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(false);
  const micMutedRef = useRef(false);
  const soundMutedRef = useRef(false);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    micMutedRef.current = micMuted;
  }, [micMuted]);

  useEffect(() => {
    soundMutedRef.current = soundMuted;
    if (soundMuted) playerRef.current?.clear();
  }, [soundMuted]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [turns]);

  useEffect(() => {
    let animation = 0;
    const data = new Uint8Array(64);
    const update = () => {
      const analyser = analyserRef.current;
      if (analyser && !micMutedRef.current) {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const sample of data) {
          const centered = (sample - 128) / 128;
          sum += centered * centered;
        }
        setLevel(Math.min(1, Math.sqrt(sum / data.length) * 4.5));
      } else {
        setLevel(0);
      }
      animation = requestAnimationFrame(update);
    };
    animation = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animation);
  }, []);

  const updateTranscript = useCallback(
    (event: RealtimeEvent, role: Turn["role"], done: boolean) => {
      const id = event.item_id ?? event.response_id ?? `${role}-active`;
      setTurns((current) => {
        const previous = current.find((turn) => turn.id === id);
        const text = done
          ? (event.transcript ?? previous?.text ?? "")
          : `${previous?.text ?? ""}${event.delta ?? ""}`;
        if (!text.trim()) return current;
        return upsertTurn(current, { id, role, text, final: done });
      });
    },
    [],
  );

  const handleRealtimeEvent = useCallback(
    (event: RealtimeEvent) => {
      switch (event.type) {
        case "concierge.upstream.connecting":
          setStatus(reconnectAttemptsRef.current ? "reconnecting" : "connecting");
          break;
        case "concierge.upstream.open":
          setModelLabel((event as RealtimeEvent & { model?: string }).model ?? "Realtime model");
          break;
        case "session.updated":
          reconnectAttemptsRef.current = 0;
          setErrorMessage("");
          setStatus("listening");
          break;
        case "input_audio_buffer.speech_started":
          playerRef.current?.clear();
          setStatus("user_speaking");
          break;
        case "input_audio_buffer.speech_stopped":
          setStatus("thinking");
          break;
        case "response.created":
          setStatus("thinking");
          break;
        case "response.output_audio.delta":
          setStatus("assistant_speaking");
          if (!soundMutedRef.current && event.delta) playerRef.current?.enqueue(event.delta);
          break;
        case "response.output_audio.done":
        case "response.done":
          setStatus("listening");
          break;
        case "conversation.item.input_audio_transcription.delta":
          updateTranscript(event, "user", false);
          break;
        case "conversation.item.input_audio_transcription.completed":
          updateTranscript(event, "user", true);
          break;
        case "response.output_audio_transcript.delta":
          updateTranscript(event, "assistant", false);
          break;
        case "response.output_audio_transcript.done":
          updateTranscript(event, "assistant", true);
          break;
        case "concierge.relay.error":
        case "error":
          setErrorMessage(event.message ?? event.error?.message ?? "The realtime session reported an error.");
          if (event.recoverable === false || event.type === "error") setStatus("error");
          break;
      }
    },
    [updateTranscript],
  );

  const openSocket = useCallback(() => {
    const socket = new WebSocket(getSocketUrl());
    socketRef.current = socket;
    setStatus(reconnectAttemptsRef.current ? "reconnecting" : "connecting");

    socket.addEventListener("message", (message) => {
      try {
        handleRealtimeEvent(JSON.parse(message.data as string) as RealtimeEvent);
      } catch {
        setErrorMessage("A malformed gateway event was ignored.");
      }
    });

    socket.addEventListener("close", (event) => {
      if (socketRef.current === socket) socketRef.current = null;
      if (!shouldReconnectRef.current) return;

      if (event.code === 1000) {
        setStatus("idle");
        return;
      }

      if (reconnectAttemptsRef.current >= 3) {
        setErrorMessage("The line could not be restored after three attempts. Check the relay and try again.");
        setStatus("error");
        shouldReconnectRef.current = false;
        return;
      }

      reconnectAttemptsRef.current += 1;
      setStatus("reconnecting");
      const wait = 500 * 2 ** (reconnectAttemptsRef.current - 1);
      reconnectTimerRef.current = window.setTimeout(openSocket, wait);
    });

    socket.addEventListener("error", () => {
      setErrorMessage("The browser could not reach the realtime relay.");
    });
  }, [handleRealtimeEvent]);

  const prepareAudio = useCallback(async () => {
    if (streamRef.current && contextRef.current) return;

    setStatus("permission");
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const context = new AudioContext({ latencyHint: "interactive", sampleRate: 24000 });
    await context.audioWorklet.addModule("/pcm-capture-worklet.js");
    await context.resume();

    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.72;
    const capture = new AudioWorkletNode(context, "concierge-pcm-capture");
    const silent = context.createGain();
    silent.gain.value = 0;

    source.connect(analyser);
    analyser.connect(capture);
    capture.connect(silent);
    silent.connect(context.destination);

    capture.port.onmessage = (message: MessageEvent<ArrayBuffer>) => {
      const socket = socketRef.current;
      if (micMutedRef.current || socket?.readyState !== WebSocket.OPEN) return;
      socket.send(
        JSON.stringify({
          type: "input_audio_buffer.append",
          audio: arrayBufferToBase64(message.data),
        }),
      );
    };

    streamRef.current = stream;
    contextRef.current = context;
    playerRef.current = new PcmPlayer(context);
    workletRef.current = capture;
    analyserRef.current = analyser;
  }, []);

  const startSession = useCallback(async () => {
    setErrorMessage("");
    try {
      await prepareAudio();
      shouldReconnectRef.current = true;
      reconnectAttemptsRef.current = 0;
      openSocket();
    } catch (error) {
      const denied = error instanceof DOMException && error.name === "NotAllowedError";
      setErrorMessage(
        denied
          ? "Microphone permission was declined. Allow access in your browser settings, then try again."
          : "The microphone could not be prepared. Check that an input device is available.",
      );
      setStatus("error");
    }
  }, [openSocket, prepareAudio]);

  const endSession = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimerRef.current) window.clearTimeout(reconnectTimerRef.current);
    socketRef.current?.close(1000, "Session ended by user");
    socketRef.current = null;
    playerRef.current?.clear();
    workletRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    void contextRef.current?.close();
    streamRef.current = null;
    contextRef.current = null;
    playerRef.current = null;
    workletRef.current = null;
    analyserRef.current = null;
    setMicMuted(false);
    setSoundMuted(false);
    setStatus("idle");
  }, []);

  useEffect(() => endSession, [endSession]);

  const isLive = status !== "idle" && status !== "error";
  const energy = status === "assistant_speaking" ? 0.82 : status === "thinking" ? 0.35 : level;
  const bars = useMemo(() => Array.from({ length: 31 }), []);

  return (
    <main className={`app state-${status}`}>
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Concierge home">
          <span className="brand-mark">C</span>
          <span>CONCIERGE</span>
        </a>
        <div className="session-pill" aria-live="polite">
          <span className="status-dot" />
          {labels[status]}
        </div>
        <div className="model-tag">{modelLabel}</div>
      </header>

      <section className="workspace" id="top">
        <div className="stage">
          <div className="kicker">LIVE WORLDBUILDING · STRATEGY · SYSTEMS</div>
          <div className="title-lockup">
            <p>Your most interesting ideas</p>
            <h1>deserve a co-conspirator.</h1>
          </div>

          <div className="orb-wrap" aria-label={`Session status: ${labels[status]}`}>
            <div className="orbit orbit-one"><span>TACTICS</span></div>
            <div className="orbit orbit-two"><span>MYTH</span></div>
            <div className="orb-shadow" />
            <button
              className="orb"
              type="button"
              onClick={isLive ? endSession : startSession}
              aria-label={isLive ? "End live session" : "Begin live session"}
            >
              <span className="orb-glint" />
              <span className="orb-label">{isLive ? "LIVE" : "CALL"}</span>
              <span className="orb-sub">{isLive ? labels[status] : "THE CONCIERGE"}</span>
            </button>
          </div>

          <div className="waveform" aria-hidden="true">
            {bars.map((_, index) => {
              const distance = Math.abs(index - bars.length / 2) / (bars.length / 2);
              const shape = Math.max(0.18, 1 - distance * 0.72);
              const variance = 0.68 + ((index * 17) % 9) / 20;
              const height = 8 + energy * 62 * shape * variance;
              return <span key={index} style={{ height: `${height}px` }} />;
            })}
          </div>

          <div className="controls">
            <button
              className="icon-button"
              type="button"
              disabled={!isLive}
              onClick={() => setMicMuted((current) => !current)}
              aria-pressed={micMuted}
            >
              <span className="control-icon">{micMuted ? "×" : "●"}</span>
              {micMuted ? "Mic paused" : "Mic live"}
            </button>
            <button className={`primary-button ${isLive ? "danger" : ""}`} type="button" onClick={isLive ? endSession : startSession}>
              {isLive ? "End session" : status === "error" ? "Try again" : "Begin session"}
            </button>
            <button
              className="icon-button"
              type="button"
              disabled={!isLive}
              onClick={() => setSoundMuted((current) => !current)}
              aria-pressed={soundMuted}
            >
              <span className="control-icon">{soundMuted ? "×" : "◖"}</span>
              {soundMuted ? "Voice muted" : "Voice on"}
            </button>
          </div>

          {errorMessage && <div className="error-banner" role="alert">{errorMessage}</div>}

          <div className="starter-grid" aria-label="Conversation starters">
            <span>TRY OPENING WITH</span>
            <button type="button">“Stress-test this world.”</button>
            <button type="button">“What am I not seeing?”</button>
            <button type="button">“Make this stranger.”</button>
          </div>
        </div>

        <aside className="transcript-panel">
          <div className="panel-head">
            <div>
              <span className="eyebrow">THE ROOM</span>
              <h2>Working notes</h2>
            </div>
            <button type="button" className="clear-button" onClick={() => setTurns([])} disabled={!turns.length}>
              Clear
            </button>
          </div>

          <div className="transcript" aria-live="polite">
            {!turns.length ? (
              <div className="empty-state">
                <span className="asterisk">✦</span>
                <p>The useful bits will gather here as you speak.</p>
                <small>Transcripts are session-local and disappear on refresh.</small>
              </div>
            ) : (
              turns.map((turn, index) => (
                <article className={`turn ${turn.role}`} key={turn.id}>
                  <div className="turn-meta">
                    <span>{turn.role === "user" ? "YOU" : "CONCIERGE"}</span>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <p>{turn.text}<span className={turn.final ? "" : "cursor"} /></p>
                </article>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>

          <footer className="panel-foot">
            <span>EPHEMERAL SESSION</span>
            <span className="privacy-mark">NO SECRETS IN BROWSER</span>
          </footer>
        </aside>
      </section>
    </main>
  );
}
