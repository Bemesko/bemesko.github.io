/**
 * Tools shown on /toolbox, grouped by area.
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

/** Grouped by the stage of delivery each tool serves, in the order a team meets them. */
export const toolbox: ToolGroup[] = [
  {
    id: 'code',
    title: 'Code',
    blurb: 'Writing the software and the automation around it.',
    tools: [
      { name: 'GitHub Copilot', level: 'preferred', note: 'daily, agentic development' },
      { name: 'Claude Code', level: 'regular' },
      { name: 'Python', level: 'regular' },
      { name: 'Bash', level: 'regular' },
      { name: 'PowerShell', level: 'regular' },
      { name: 'TypeScript / Node.js', level: 'used' },
    ],
  },
  {
    id: 'provision',
    title: 'Provision',
    blurb: 'Clouds and the code that sets them up.',
    tools: [
      { name: 'Terraform', level: 'preferred', note: 'author of a 29-module library' },
      { name: 'Microsoft Azure', level: 'preferred', note: 'main cloud in every job so far' },
      { name: 'AWS', level: 'regular' },
      { name: 'Bicep', level: 'used' },
      { name: 'Ansible', level: 'used' },
      { name: 'Azure Policy', level: 'used' },
      { name: 'Azure Lighthouse', level: 'used' },
    ],
  },
  {
    id: 'ship',
    title: 'Ship',
    blurb: 'Building, packaging and delivering every change.',
    tools: [
      { name: 'GitHub Actions', level: 'regular' },
      { name: 'Azure DevOps', level: 'regular' },
      { name: 'Jenkins', level: 'regular' },
      { name: 'ArgoCD', level: 'regular', note: 'GitOps' },
      { name: 'Docker', level: 'regular' },
      { name: 'Helm', level: 'regular' },
      { name: 'Kustomize', level: 'used' },
    ],
  },
  {
    id: 'run',
    title: 'Run',
    blurb: 'Where workloads, data and AI agents live.',
    tools: [
      { name: 'Kubernetes (AKS)', level: 'regular' },
      { name: 'Azure AI Foundry', level: 'regular' },
      { name: 'MCP servers', level: 'regular' },
      { name: 'EKS, on-prem & k3s', level: 'used' },
      { name: 'Azure Container Apps', level: 'used' },
      { name: 'Azure Functions', level: 'used' },
      { name: 'PostgreSQL', level: 'used' },
      { name: 'Azure SQL', level: 'used' },
      { name: 'Kafka', level: 'used' },
      { name: 'Azure Service Bus', level: 'used' },
      { name: 'Microsoft Fabric & Spark', level: 'used' },
      { name: 'GCP BigQuery', level: 'used', note: 'scoped access for AI agents' },
    ],
  },
  {
    id: 'observe',
    title: 'Observe',
    blurb: 'Knowing what happened in production, and why.',
    tools: [
      { name: 'OpenTelemetry', level: 'regular' },
      { name: 'Prometheus', level: 'regular' },
      { name: 'Grafana', level: 'regular' },
      { name: 'Jaeger', level: 'regular' },
      { name: 'Graylog', level: 'regular' },
      { name: 'Elasticsearch, Kibana & Fluent Bit', level: 'regular' },
      { name: 'Application Insights / Azure Monitor', level: 'regular' },
      { name: 'Loki, Tempo & Mimir', level: 'used', note: 'homelab' },
      { name: 'Linux, tcpdump & strace', level: 'used' },
    ],
  },
  {
    id: 'secure',
    title: 'Secure',
    blurb: 'Who can touch what, and catching problems before they ship.',
    tools: [
      { name: 'Entra ID', level: 'regular' },
      { name: 'RBAC & least privilege', level: 'regular' },
      { name: 'Azure Key Vault', level: 'used' },
      { name: 'SOPS / age', level: 'used' },
      { name: 'Checkov, tfsec, Trivy', level: 'used' },
      { name: 'SonarQube, OWASP ZAP, Dependabot', level: 'used' },
      { name: 'Microsoft Defender', level: 'used' },
    ],
  },
];
