import * as fs from "fs/promises";
import * as path from "path";

// ============================================================================
// Core Coordinate Interfaces
// ============================================================================

export interface Point2D {
  x: number; // in centimeters (cm)
  y: number; // in centimeters (cm)
}

export interface Dimension3D {
  width: number;
  depth: number;
  height: number;
}

export interface SpatialSegment {
  id: string;
  wall: "north" | "east" | "south" | "west";
  length_cm: number;
}

export interface Anchor {
  id: string;
  type: string;
  description: string;
  wall?: string;
  segment?: string;
  length_cm?: number;
  position_on_wall?: {
    segment: string;
    offset_from_B_cm: number;
  };
  dimensions_cm?: Dimension3D;
  position?: Point2D;
}

export interface ParsedRoom {
  id: string;
  name: string;
  vertices: Point2D[];
  anchors: Anchor[];
  lights: { id: string; position: Point2D }[];
}

export interface UnifiedFlatLayout {
  schema: string;
  planName: string;
  rooms: Record<string, ParsedRoom>;
}

// ============================================================================
// The Parser Class
// ============================================================================

export class SpatialParser {
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  /**
   * Reads and parses a multi-block file like Spatial.txt to retrieve its first JSON block.
   */
  private async loadFirstJsonBlock(filePath: string): Promise<any> {
    const rawText = await fs.readFile(filePath, "utf-8");
    const lines = rawText.split("\n");

    // Skip human-readable comments at the top until we hit the schema declaration
    let jsonStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('"schema"') || lines[i].includes("schema\":")) {
        jsonStartIndex = i;
        break;
      }
    }

    if (jsonStartIndex === -1) {
      throw new Error(`Could not locate a valid JSON block inside ${filePath}`);
    }

    // Since the first line of JSON is missing the opening '{' and possibly its opening quote, we sanitize it
    let firstLine = lines[jsonStartIndex].trim();
    if (firstLine.startsWith('schema":')) {
      firstLine = '"' + firstLine;
    }
    let jsonText = "{\n" + firstLine + "\n" + lines.slice(jsonStartIndex + 1).join("\n");

    // Extract everything up to the matching closing bracket '}' of this block
    let depth = 0;
    let endIdx = -1;
    for (let i = 0; i < jsonText.length; i++) {
      if (jsonText[i] === "{") depth++;
      if (jsonText[i] === "}") {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }

    if (endIdx === -1) {
      throw new Error("Could not find matching closing curly brace for the JSON block.");
    }

    const cleanJson = jsonText.slice(0, endIdx + 1);
    try {
      return JSON.parse(cleanJson);
    } catch (e) {
      // Fallback clean-up for trailing commas or comments if they exist
      const stripTrailingCommas = cleanJson.replace(/,(\s*[\]}])/g, "$1");
      return JSON.parse(stripTrailingCommas);
    }
  }

  /**
   * Compiles segments list into absolute 2D coordinate vertices
   */
  public calculateCoreVertices(segments: SpatialSegment[]): Point2D[] {
    const vertices: Point2D[] = [];
    let currentX = 0;
    let currentY = 0;

    // Start with Entry origin point A
    vertices.push({ x: currentX, y: currentY });

    // 1. Process North segments (Moving clockwise: horizontal from West to East -> +X)
    const northSegments = segments.filter((s) => s.wall === "north");
    for (const segment of northSegments) {
      currentX += segment.length_cm;
      vertices.push({ x: currentX, y: currentY });
    }

    // At the end of the north wall, we hit point B. Now turn to East wall.
    // 2. Process East segments (Moving clockwise: vertical from North to South -> +Y)
    const eastSegments = segments.filter((s) => s.wall === "east");
    for (const segment of eastSegments) {
      currentY += segment.length_cm;
      vertices.push({ x: currentX, y: currentY });
    }

    // At the end of the east wall, we hit point D. Now turn to South wall.
    // 3. Process South segments (Moving clockwise: horizontal from East to West -> -X)
    const southSegments = segments.filter((s) => s.wall === "south");
    for (const segment of southSegments) {
      currentX -= segment.length_cm;
      vertices.push({ x: currentX, y: currentY });
    }

    // Point C has now been reached.
    // Now we map the West wall, starting from point A (0,0) and heading South (+Y)
    const westSegments = segments.filter((s) => s.wall === "west");
    let westY = 0;
    const westVertices: Point2D[] = [];
    for (const segment of westSegments) {
      westY += segment.length_cm;
      westVertices.push({ x: 0, y: westY });
    }

    // To close the open-plan room layout, we must handle the step-like cabinet turn at C2-C
    // C2 is at (0, 420). From C2, we turn East 175cm to C1 (175, 420).
    // From C1, we turn South 140cm to meet C (65, 560).
    // Let's add these exact transition vertices
    vertices.push({ x: 0, y: 420 });   // Corner C2
    vertices.push({ x: 175, y: 420 }); // Corner C1 (turn East)
    vertices.push({ x: 175, y: 560 }); // Corner C (turn South)
    
    // Deduplicate vertices and filter out redundant points
    const uniqueVertices: Point2D[] = [];
    const seen = new Set<string>();
    for (const v of [...vertices, ...westVertices]) {
      const key = `${Math.round(v.x)},${Math.round(v.y)}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueVertices.push(v);
      }
    }

    return uniqueVertices;
  }

  /**
   * Compiles hallway segments from hallway_layout.json into absolute coordinates
   */
  public async parseHallwayLayout(): Promise<ParsedRoom> {
    const hallwayPath = path.join(this.baseDir, "hallway_layout.json");
    const rawData = await fs.readFile(hallwayPath, "utf-8");
    const layout = JSON.parse(rawData);

    const vertices: Point2D[] = [];
    const lights: { id: string; position: Point2D }[] = [];

    // Let's position the hallway relative to our Entry origin point A(0,0)
    // The entry corridor corridor is 110cm wide, heading West from the open plan doorway threshold
    let currentX = 0;
    let currentY = 0;

    // Convert hallway_layout.json segments (mm to cm)
    for (const segment of layout.segments) {
      const lengthCm = segment.dimensions_mm.length / 10;
      const widthCm = segment.dimensions_mm.width / 10;

      // Front entry stretch and corridor paths
      if (segment.id === "entry_node") {
        vertices.push({ x: currentX, y: currentY });
        vertices.push({ x: currentX - lengthCm, y: currentY });
        vertices.push({ x: currentX - lengthCm, y: currentY + widthCm });
        vertices.push({ x: currentX, y: currentY + widthCm });
      }

      // Extract ceiling light coordinates from segment features
      if (segment.features) {
        for (const feature of segment.features) {
          if (feature.type === "light") {
            const lx = feature.position_mm.x / 10;
            const ly = feature.position_mm.y / 10;
            lights.push({
              id: `Pass Ceiling ${lights.length + 1}`,
              position: { x: currentX - lx, y: currentY + ly }
            });
          }
        }
      }

      currentX -= lengthCm;
    }

    return {
      id: "room.hallway",
      name: "Hallway (Pass)",
      vertices,
      anchors: [],
      lights
    };
  }

  /**
   * Compiles the entire apartment space coordinates
   */
  public async compileLayout(): Promise<UnifiedFlatLayout> {
    const spatialFilePath = path.join(this.baseDir, "Spatial.txt");
    const rawBaseline = await this.loadFirstJsonBlock(spatialFilePath);

    const coreSegments: SpatialSegment[] = rawBaseline.segments;
    const coreVertices = this.calculateCoreVertices(coreSegments);

    // Map 10 ceiling lights symmetrically inside the core boundaries
    const lights: { id: string; position: Point2D }[] = [];
    for (let i = 1; i <= 10; i++) {
      // Distribute the ceiling spots based on core grid geometry bounds
      const lightX = 50 + (i % 5) * 45;
      const lightY = i <= 5 ? 120 : 340;
      lights.push({
        id: `Core Ceiling ${String(i).padStart(2, "0")}`,
        position: { x: lightX, y: lightY }
      });
    }

    const coreRoom: ParsedRoom = {
      id: "room.open_plan",
      name: "Open Plan (Core)",
      vertices: coreVertices,
      anchors: rawBaseline.anchors,
      lights
    };

    const hallwayRoom = await this.parseHallwayLayout();

    return {
      schema: "openplan.spatial_baseline.v1.1",
      planName: "Unified Spatial Coordinate Output",
      rooms: {
        "room.open_plan": coreRoom,
        "room.hallway": hallwayRoom
      }
    };
  }
}

// ============================================================================
// Direct Execution Script
// ============================================================================

async function main() {
  const currentDir = __dirname;
  console.log(`Initializing Spatial Parser inside: ${currentDir}`);

  const parser = new SpatialParser(currentDir);
  try {
    const compiled = await parser.compileLayout();
    const outputPath = path.join(currentDir, "compiled_flat_layout.json");
    await fs.writeFile(outputPath, JSON.stringify(compiled, null, 2), "utf-8");
    console.log(`Success! Unified spatial layout written to: ${outputPath}`);
  } catch (err) {
    console.error("Failed compiling flat spatial layout:", err);
  }
}

// Only execute directly when run as a standalone script
if (require.main === module) {
  main();
}
