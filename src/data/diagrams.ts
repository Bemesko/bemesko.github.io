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
  homelab: {
    caption: 'Vertical cut of the homelab. Use the buttons to isolate each layer.',
    layers: [
      { id: 'p', label: 'Product' },
      { id: 'd', label: 'Development' },
      { id: 'i', label: 'Infrastructure' },
    ],
    nodes: [
      { layer: 'p', x: 60, w: 200, title: 'Household', sub: 'phones on the tailnet' },
      { layer: 'p', x: 470, w: 230, title: 'Self-hosted apps', sub: 'photos · notes · groceries' },
      { layer: 'd', x: 60, w: 170, title: 'App template', sub: 'init.sh · kube-linter' },
      { layer: 'd', x: 280, w: 200, title: 'Release workflow', sub: 'image @digest · semver tag' },
      { layer: 'd', x: 530, w: 190, title: 'PR to central repo', sub: 'targetRevision: vX.Y.Z' },
      { layer: 'i', x: 60, w: 170, title: 'Ansible', sub: '11 roles · idempotent' },
      { layer: 'i', x: 280, w: 200, title: 'k3s + ArgoCD', sub: 'app-of-apps · ksops' },
      { layer: 'i', x: 530, w: 190, title: 'NAS + OTel/LGTM', sub: 'nfs · ~40 alerts' },
    ],
    edges: [
      { layer: 'p', d: 'M260 55 L470 55', flow: true },
      { layer: 'd', d: 'M230 155 L280 155', flow: true },
      { layer: 'd', d: 'M480 155 L530 155', flow: true },
      { layer: 'd', d: 'M625 178 L625 205 L380 205 L380 232', flow: true },
      { layer: 'i', d: 'M230 255 L280 255' },
      { layer: 'i', d: 'M480 255 L530 255' },
      { layer: 'i', d: 'M330 232 L330 215 L255 215 L255 105 L585 105 L585 78', flow: true },
    ],
    notes: [{ x: 420, y: 196, text: 'ships only through Git', rotate: -2 }],
  },
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
