/**
 * Layered diagrams, keyed by name. A project references one through its
 * `diagram` frontmatter field so it can be shown both on the home page and
 * inside the case study. Each layer is a 100-unit band in a 760-wide viewBox;
 * nodes sit at y = layer * 100 + 32 and are 46 tall.
 */
export interface DiagramSpec {
  caption: string;
  layers: { id: string; label: string }[];
  nodes: { layer: string; x: number; w?: number; title: string; sub?: string }[];
  edges?: { layer: string; d: string; flow?: boolean }[];
  notes?: { x: number; y: number; text: string; rotate?: number }[];
}

export const diagrams: Record<string, DiagramSpec> = {
  'pricing-agents': {
    caption: 'Vertical cut of the system. Use the buttons to isolate each layer.',
    layers: [
      { id: 'p', label: 'Product' },
      { id: 'd', label: 'Development' },
      { id: 'i', label: 'Infrastructure' },
    ],
    nodes: [
      { layer: 'p', x: 60, w: 200, title: 'Pricing team', sub: 'asks in natural language' },
      { layer: 'p', x: 470, w: 230, title: 'Success metric', sub: 'baseline first, then accuracy' },
      { layer: 'd', x: 60, w: 160, title: 'Web app', sub: 'adonisjs · entra login' },
      { layer: 'd', x: 290, w: 190, title: '3 AI agents', sub: 'azure ai foundry' },
      { layer: 'd', x: 540, w: 170, title: 'MCP server', sub: 'data gateway' },
      { layer: 'i', x: 60, w: 160, title: 'Entra ID', sub: 'identity' },
      { layer: 'i', x: 290, w: 190, title: 'Guardrails', sub: 'budgets · tags · alerts' },
      { layer: 'i', x: 540, w: 170, title: 'BigQuery (GCP)', sub: 'pricing data' },
    ],
    edges: [
      { layer: 'd', d: 'M140 78 L140 132', flow: true },
      { layer: 'd', d: 'M220 155 L290 155', flow: true },
      { layer: 'd', d: 'M480 155 L540 155', flow: true },
      { layer: 'd', d: 'M385 132 L385 105 L585 105 L585 78', flow: true },
      { layer: 'i', d: 'M140 232 L140 178' },
      { layer: 'i', d: 'M385 232 L385 178' },
      { layer: 'i', d: 'M625 178 L625 232', flow: true },
    ],
    notes: [{ x: 420, y: 214, text: 'read-only, scoped tables →', rotate: -2 }],
  },
};
