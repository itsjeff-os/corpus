const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  for (const [k, v] of Object.entries(JSON_HEADERS)) headers.set(k, v);
  return new Response(JSON.stringify(data, null, 2), { ...init, headers });
}

function error(status, message, details = undefined) {
  return json({ ok: false, error: message, details }, { status });
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readJson(request) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Expected application/json request body.');
  }
  return await request.json();
}

function sessionStub(env, sessionId) {
  const id = env.INTEGRITY_SESSION.idFromName(sessionId);
  return env.INTEGRITY_SESSION.get(id);
}

function routeFrom(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  // /sessions/:id/... or /health
  if (parts.length === 1 && parts[0] === 'health') {
    return { kind: 'health' };
  }
  if (parts.length >= 2 && parts[0] === 'sessions') {
    return {
      kind: 'session',
      sessionId: parts[1],
      tail: parts.slice(2)
    };
  }
  return { kind: 'unknown' };
}

function buildInternalUrl(pathname, search = '') {
  return `https://integrity.internal${pathname}${search}`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const route = routeFrom(url.pathname);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'access-control-allow-headers': 'content-type, authorization'
        }
      });
    }

    if (route.kind === 'health') {
      return json({ ok: true, service: 'constraint-integrity-worker' });
    }

    if (route.kind !== 'session') {
      return error(404, 'Route not found.');
    }

    if (!route.sessionId) {
      return error(400, 'Missing session id.');
    }

    const stub = sessionStub(env, route.sessionId);
    const internalPath = `/${route.tail.join('/')}`;
    const forwardUrl = buildInternalUrl(internalPath === '/' ? '/state' : internalPath, url.search);
    const forwarded = new Request(forwardUrl, request);
    const response = await stub.fetch(forwarded);
    const headers = new Headers(response.headers);
    headers.set('access-control-allow-origin', '*');
    headers.set('vary', 'origin');
    return new Response(response.body, {
      status: response.status,
      headers
    });
  }
};

export class IntegritySession {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
    this.statePromise = null;
  }

  async fetch(request) {
    const url = new URL(request.url);
    try {
      if (request.method === 'GET' && url.pathname === '/state') {
        return json({ ok: true, state: await this.getState() });
      }

      if (request.method === 'DELETE' && url.pathname === '/reset') {
        await this.saveState(defaultState());
        return json({ ok: true, state: await this.getState() });
      }

      if (request.method === 'PUT' && url.pathname === '/constraints') {
        const body = await readJson(request);
        if (!Array.isArray(body.constraints)) {
          return error(400, 'constraints must be an array.');
        }
        const state = await this.getState();
        state.constraints = normalizeConstraints(body.constraints);
        state.updatedAt = new Date().toISOString();
        await this.saveState(state);
        return json({ ok: true, state });
      }

      if (request.method === 'POST' && url.pathname === '/constraints/append') {
        const body = await readJson(request);
        if (!Array.isArray(body.constraints)) {
          return error(400, 'constraints must be an array.');
        }
        const state = await this.getState();
        state.constraints = dedupeById([...state.constraints, ...normalizeConstraints(body.constraints)]);
        state.updatedAt = new Date().toISOString();
        await this.saveState(state);
        return json({ ok: true, state });
      }

      if (request.method === 'POST' && url.pathname === '/ban-class') {
        const body = await readJson(request);
        if (typeof body.solutionClass !== 'string' || !body.solutionClass.trim()) {
          return error(400, 'solutionClass must be a non-empty string.');
        }
        const state = await this.getState();
        const solutionClass = body.solutionClass.trim();
        if (!state.bannedSolutionClasses.includes(solutionClass)) {
          state.bannedSolutionClasses.push(solutionClass);
        }
        state.updatedAt = new Date().toISOString();
        await this.saveState(state);
        return json({ ok: true, state });
      }

      if (request.method === 'POST' && url.pathname === '/ban-mechanisms') {
        const body = await readJson(request);
        if (!Array.isArray(body.mechanisms)) {
          return error(400, 'mechanisms must be an array of strings.');
        }
        const state = await this.getState();
        for (const mechanism of body.mechanisms) {
          if (typeof mechanism === 'string' && mechanism.trim() && !state.bannedMechanisms.includes(mechanism.trim())) {
            state.bannedMechanisms.push(mechanism.trim());
          }
        }
        state.updatedAt = new Date().toISOString();
        await this.saveState(state);
        return json({ ok: true, state });
      }

      if (request.method === 'POST' && url.pathname === '/validate') {
        const body = await readJson(request);
        if (!isObject(body.proposal)) {
          return error(400, 'proposal must be an object.');
        }
        const state = await this.getState();
        const result = validateProposal(state, body.proposal);
        if (!result.allowed && body.autoban === true && body.proposal.solutionClass) {
          const solutionClass = String(body.proposal.solutionClass).trim();
          if (solutionClass && !state.bannedSolutionClasses.includes(solutionClass)) {
            state.bannedSolutionClasses.push(solutionClass);
          }
        }
        if (!result.allowed) {
          state.lastViolation = {
            at: new Date().toISOString(),
            reasons: result.reasons,
            proposalSummary: summarizeProposal(body.proposal)
          };
          state.violationCount += 1;
          state.updatedAt = new Date().toISOString();
          await this.saveState(state);
        }
        return json({ ok: true, validation: result, state });
      }

      return error(404, 'Session route not found.');
    } catch (err) {
      return error(400, err instanceof Error ? err.message : 'Unexpected error.');
    }
  }

  async getState() {
    if (!this.statePromise) {
      this.statePromise = this.ctx.storage.get('state').then((stored) => stored || defaultState());
    }
    return structuredClone(await this.statePromise);
  }

  async saveState(state) {
    this.statePromise = Promise.resolve(structuredClone(state));
    await this.ctx.storage.put('state', state);
  }
}

function defaultState() {
  const now = new Date().toISOString();
  return {
    constraints: [],
    bannedSolutionClasses: [],
    bannedMechanisms: [],
    violationCount: 0,
    lastViolation: null,
    createdAt: now,
    updatedAt: now
  };
}

function normalizeConstraints(input) {
  return input.map((constraint, index) => {
    if (!isObject(constraint)) {
      throw new Error(`Constraint at index ${index} must be an object.`);
    }
    const id = typeof constraint.id === 'string' && constraint.id.trim() ? constraint.id.trim() : `C${index + 1}`;
    const type = constraint.type === 'requirement' ? 'requirement' : 'prohibition';
    const target = String(constraint.target || '').trim();
    if (!target) {
      throw new Error(`Constraint ${id} is missing a target.`);
    }
    const description = typeof constraint.description === 'string' ? constraint.description : '';
    return { id, type, target, description };
  });
}

function dedupeById(constraints) {
  const map = new Map();
  for (const constraint of constraints) {
    map.set(constraint.id, constraint);
  }
  return [...map.values()];
}

function summarizeProposal(proposal) {
  return {
    solutionClass: typeof proposal.solutionClass === 'string' ? proposal.solutionClass : null,
    mechanisms: isObject(proposal.mechanisms) ? proposal.mechanisms : {},
    claims: Array.isArray(proposal.claims) ? proposal.claims.map((claim) => claim.type || 'unknown') : []
  };
}

function validateProposal(state, proposal) {
  const reasons = [];
  const mechanisms = isObject(proposal.mechanisms) ? proposal.mechanisms : {};
  const solutionClass = typeof proposal.solutionClass === 'string' ? proposal.solutionClass.trim() : '';
  const claims = Array.isArray(proposal.claims) ? proposal.claims : [];
  const structuralDelta = isObject(proposal.structuralDelta) ? proposal.structuralDelta : null;

  if (!solutionClass) {
    reasons.push({ code: 'missing_solution_class', message: 'proposal.solutionClass is required.' });
  }

  if (solutionClass && state.bannedSolutionClasses.includes(solutionClass)) {
    reasons.push({
      code: 'banned_solution_class',
      message: `Solution class "${solutionClass}" is banned for this session.`
    });
  }

  for (const mechanism of state.bannedMechanisms) {
    if (mechanisms[mechanism] === true) {
      reasons.push({
        code: 'banned_mechanism',
        message: `Mechanism "${mechanism}" is banned for this session.`
      });
    }
  }

  for (const constraint of state.constraints) {
    const value = mechanisms[constraint.target] === true;
    if (constraint.type === 'prohibition' && value) {
      reasons.push({
        code: 'prohibited_mechanism_present',
        message: `Constraint ${constraint.id} violated: prohibited mechanism "${constraint.target}" is present.`,
        constraint
      });
    }
    if (constraint.type === 'requirement' && !value) {
      reasons.push({
        code: 'required_mechanism_missing',
        message: `Constraint ${constraint.id} violated: required mechanism "${constraint.target}" is absent.`,
        constraint
      });
    }
  }

  for (const claim of claims) {
    if (!isObject(claim)) continue;
    if (claim.type === 'intent_attribution') {
      if (typeof claim.evidenceQuote !== 'string' || !claim.evidenceQuote.trim()) {
        reasons.push({
          code: 'intent_without_quote',
          message: 'Intent attribution claim requires a direct evidenceQuote.'
        });
      }
    }

    if (claim.type === 'structural_difference') {
      if (!structuralDelta) {
        reasons.push({
          code: 'difference_without_delta',
          message: 'Structural difference claim requires proposal.structuralDelta.'
        });
        continue;
      }

      const previousRequired = Array.isArray(structuralDelta.previousRequired)
        ? structuralDelta.previousRequired.filter((x) => typeof x === 'string' && x.trim())
        : [];
      const currentForbidden = Array.isArray(structuralDelta.currentForbidden)
        ? structuralDelta.currentForbidden.filter((x) => typeof x === 'string' && x.trim())
        : [];

      for (const mechanism of previousRequired) {
        if (!currentForbidden.includes(mechanism) && mechanisms[mechanism] === true) {
          reasons.push({
            code: 'difference_claim_failed',
            message: `Structural difference claim failed: mechanism "${mechanism}" still appears in the current proposal.`
          });
        }
      }
    }
  }

  return {
    allowed: reasons.length === 0,
    reasons
  };
}
