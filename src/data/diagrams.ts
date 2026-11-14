/**
 * Layered diagrams, keyed by name. A project references one through its
 * `diagram` frontmatter field so it can be shown both on the home page and
 * inside the case study.
 */
export interface DiagramSpec {
  caption: string;
  layers: { id: string; label: string }[];
  nodes: { layer: string; x: number; w?: number; title: string; sub?: string }[];
  edges?: { layer: string; d: string; flow?: boolean }[];
  notes?: { x: number; y: number; text: string; rotate?: number }[];
}

export const diagrams: Record<string, DiagramSpec> = {
  'context-platform': {
    caption: 'Vertical cut of the system. Use the buttons to isolate each layer.',
    layers: [
      { id: 'p', label: 'Product' },
      { id: 'd', label: 'Development' },
      { id: 'i', label: 'Infrastructure' },
    ],
    nodes: [
      { layer: 'p', x: 120, title: 'Business user', sub: 'asks in natural language' },
      { layer: 'p', x: 520, title: 'Value metric', sub: 'time saved · adoption' },
      { layer: 'd', x: 300, w: 190, title: 'Agent orchestrator', sub: 'spec-driven · evals' },
      { layer: 'i', x: 90, w: 160, title: 'Sources', sub: 'erp · crm · docs' },
      { layer: 'i', x: 300, w: 190, title: 'Postgres + pgvector', sub: 'canonical schema' },
      { layer: 'i', x: 540, w: 160, title: 'Container Apps', sub: 'managed identity' },
    ],
    edges: [
      { layer: 'd', d: 'M205 78 L205 155 L300 155', flow: true },
      { layer: 'd', d: 'M490 155 L605 155 L605 78', flow: true },
      { layer: 'i', d: 'M250 255 L300 255' },
      { layer: 'i', d: 'M490 255 L540 255' },
      { layer: 'i', d: 'M395 232 L395 178', flow: true },
    ],
    notes: [{ x: 505, y: 214, text: '← per-customer isolation lives here', rotate: -3 }],
  },
};
