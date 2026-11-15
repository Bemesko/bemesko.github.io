/**
 * Tools shown on /toolbox, grouped by delivery stage.
 * level: 'preferred' = default pick / daily driver,
 *        'regular'   = used regularly,
 *        'used'      = used on specific projects.
 */
export type Level = 'preferred' | 'regular' | 'used';

export interface Tool {
  name: string;
  level: Level;
  note?: string;
}
export interface ToolGroup {
  id: string;
  title: string;
  blurb: string;
  tools: Tool[];
}

export const LEVELS: Record<Level, { mark: string; label: string }> = {
  preferred: { mark: '◆', label: 'preferred' },
  regular: { mark: '◇', label: 'used regularly' },
  used: { mark: '·', label: 'used on projects' },
};

/**
 * Grouped by the stage of delivery each tool serves, in the order a team meets them.
 * One tool per entry: never combine two tools in a name or list others in a note.
 */
export const toolbox: ToolGroup[] = [
  {
    id: 'code',
    title: 'Code',
    blurb: 'Languages, frameworks and the tools I write them with.',
    tools: [
      { name: 'Claude Code', level: 'preferred', note: 'Agentic Development' },
      { name: 'Python', level: 'preferred', note: 'General Purpose Programming' },
      { name: 'Bash', level: 'preferred', note: 'Scripting Language' },
      { name: 'GitHub Copilot', level: 'regular', note: 'daily, agentic development' },
      { name: 'PowerShell', level: 'regular' },
      { name: 'Node.js', level: 'regular' },
      { name: '.NET', level: 'regular' },
      { name: 'just', level: 'regular' },
      { name: 'FastAPI', level: 'regular' },
      { name: 'pre-commit', level: 'used' },
      { name: 'Make', level: 'used' },
      { name: 'Vim', level: 'used' },
      { name: 'Neovim', level: 'used' },
      { name: 'Streamlit', level: 'used' },
      { name: 'pandas', level: 'used' },
      { name: 'JupyterLab', level: 'used' },
      { name: 'TypeScript', level: 'used' },
      { name: 'AdonisJS', level: 'used' },
      { name: 'Nuxt', level: 'used' },
      { name: 'React', level: 'used' },
      { name: 'Java', level: 'used' },
      { name: 'C#', level: 'used' },
      { name: 'Unity', level: 'used', note: 'EcoTour GL' },
    ],
  },
  {
    id: 'provision',
    title: 'Provision',
    blurb: 'Clouds, and the code that sets them up.',
    tools: [
      { name: 'Terraform', level: 'preferred', note: 'Infrastructure Provisioning' },
      { name: 'Microsoft Azure', level: 'preferred', note: 'Cloud Provider' },
      { name: 'Ansible', level: 'preferred', note: 'Configuration Management' },
      { name: 'AWS', level: 'regular' },
      { name: 'Bicep', level: 'regular' },
      { name: 'Azure Lighthouse', level: 'used' },
      { name: 'Hetzner Cloud', level: 'used' },
      { name: 'Cloudflare', level: 'used' },
    ],
  },
  {
    id: 'ship',
    title: 'Ship',
    blurb: 'Building, packaging and delivering every change.',
    tools: [
      { name: 'GitHub', level: 'preferred', note: 'Repositories and Collaboration' },
      { name: 'GitHub Actions', level: 'preferred', note: 'CI/CD and Automation' },
      { name: 'ArgoCD', level: 'preferred', note: 'GitOps' },
      { name: 'Podman', level: 'preferred', note: 'Container Engine' },
      { name: 'Docker', level: 'regular' },
      { name: 'Azure DevOps', level: 'regular' },
      { name: 'Azure Pipelines', level: 'regular' },
      { name: 'Helm', level: 'regular' },
      { name: 'Kustomize', level: 'regular' },
      { name: 'Jenkins', level: 'used' },
      { name: 'Docker Compose', level: 'used' },
      { name: 'Harbor', level: 'used' },
      { name: 'Azure Container Registry', level: 'used' },
      { name: 'Elastic Container Registry (ECR)', level: 'used' },
      { name: 'Docker Hub', level: 'used' },
    ],
  },
  {
    id: 'run',
    title: 'Run',
    blurb: 'Where workloads and AI agents live.',
    tools: [
      { name: 'Azure Container Apps', level: 'preferred', note: 'Simple App Hosting' },
      { name: 'Azure Kubernetes Service (AKS)', level: 'preferred', note: 'Platform Foundation' },
      { name: 'Microsoft Foundry', level: 'preferred', note: 'LLM and Agent Hosting' },
      { name: 'Elastic Kubernetes Service (EKS)', level: 'regular' },
      { name: 'Kafka', level: 'regular' },
      { name: 'Traefik', level: 'regular' },
      { name: 'kubeadm', level: 'regular' },
      { name: 'k3s', level: 'used' },
      { name: 'Azure App Service', level: 'used' },
      { name: 'Azure Functions', level: 'used' },
      { name: 'Azure Service Bus', level: 'used' },
      { name: 'NATS', level: 'used' },
      { name: 'ingress-nginx', level: 'used' },
      { name: 'Azure Application Gateway', level: 'used' },
    ],
  },
  {
    id: 'store',
    title: 'Store',
    blurb: 'Databases and data platforms behind the apps.',
    tools: [
      { name: 'PostgreSQL', level: 'preferred', note: 'Relational Database' },
      { name: 'Redis', level: 'preferred', note: 'Caching' },
      { name: 'Azure SQL Database', level: 'regular' },
      { name: 'Azure Cache for Redis', level: 'regular' },
      { name: 'Microsoft Fabric', level: 'regular' },
      { name: 'SQL Server', level: 'used' },
      { name: 'Oracle Database', level: 'used' },
      { name: 'Azure Cosmos DB', level: 'used' },
      { name: 'Google BigQuery', level: 'used', note: 'scoped access for AI agents' },
      { name: 'Apache Spark', level: 'used' },
    ],
  },
  {
    id: 'observe',
    title: 'Observe',
    blurb: 'Knowing what happened in production, and why.',
    tools: [
      {
        name: 'OpenTelemetry',
        level: 'preferred',
        note: 'Instrumentation and Telemetry Pipelines',
      },
      { name: 'Grafana', level: 'preferred', note: 'Visualization' },
      { name: 'Prometheus', level: 'preferred', note: 'Metrics Storage' },
      { name: 'Loki', level: 'preferred', note: 'Logs Storage' },
      { name: 'Tempo', level: 'preferred', note: 'Traces Storage' },
      { name: 'Azure Application Insights', level: 'regular' },
      { name: 'Azure Monitor', level: 'regular' },
      { name: 'Elasticsearch', level: 'regular' },
      { name: 'Kibana', level: 'regular' },
      { name: 'Fluent Bit', level: 'regular' },
      { name: 'Jaeger', level: 'used' },
      { name: 'Graylog', level: 'used' },
      { name: 'OpenSearch', level: 'used' },
      { name: 'Seq', level: 'used' },
      { name: 'Mimir', level: 'used', note: 'homelab' },
    ],
  },
  {
    id: 'secure',
    title: 'Secure',
    blurb: 'Who can touch what, what it costs, and catching problems before they ship.',
    tools: [
      { name: 'Kubescape', level: 'preferred', note: 'Kubernetes Runtime Security' },
      { name: 'Tailscale', level: 'preferred', note: 'Zero Trust Networking and Mesh VPN' },
      { name: 'Entra ID', level: 'preferred', note: 'Identity Management' },
      { name: 'Azure Policy', level: 'preferred', note: 'Policy as Code' },
      { name: 'Keycloak', level: 'regular' },
      { name: 'SonarQube', level: 'regular' },
      { name: 'Dependabot', level: 'regular' },
      { name: 'Trivy', level: 'regular' },
      { name: 'OpenCost', level: 'regular' },
      { name: 'cert-manager', level: 'used' },
      { name: 'Azure Key Vault', level: 'used' },
      { name: 'External Secrets Operator', level: 'used' },
      { name: 'SOPS', level: 'used' },
      { name: 'Cloud Custodian', level: 'used' },
      { name: 'Checkov', level: 'used' },
      { name: 'OWASP ZAP', level: 'used' },
      { name: 'Microsoft Defender', level: 'used' },
      { name: 'Infracost', level: 'used' },
    ],
  },
  {
    id: 'docs',
    title: 'Docs',
    blurb: 'Writing it down and drawing it out, so it outlives the project.',
    tools: [
      { name: 'Obsidian', level: 'preferred', note: 'Writing Tool' },
      { name: 'Excalidraw', level: 'preferred', note: 'Diagramming' },
      { name: 'LaTeX', level: 'regular' },
      { name: 'Mermaid', level: 'regular' },
      { name: 'Docusaurus', level: 'regular' },
      { name: 'GitBook', level: 'used' },
      { name: 'BookStack', level: 'used' },
    ],
  },
];
