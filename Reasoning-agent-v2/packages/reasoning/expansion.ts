export type GraphExpansionDepth = 'thin' | 'expanded' | 'deep';

export function shouldExpandGraph(depth: GraphExpansionDepth): boolean {
  return depth === 'expanded' || depth === 'deep';
}
