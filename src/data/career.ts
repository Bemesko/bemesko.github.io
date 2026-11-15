/** Career facts shared by the home page and About. */
export interface Role {
  when: string;
  /** Compact range for tight spaces, e.g. "2024 – 25". */
  short: string;
  where: string;
  what: string;
}

export const timeline: Role[] = [
  {
    when: '2025 – now',
    short: '2025 – now',
    where: 'SOU',
    what: 'DevOps Engineer at a top-5 Microsoft solutions partner in LATAM. Terraform golden paths, FinOps, and the infrastructure behind AI agents in production.',
  },
  {
    when: '2024 – 2025',
    short: '2024 – 25',
    where: 'Vetta (SMS Group)',
    what: 'DevOps Engineer on Viridis, the platform that runs steel plants. OpenTelemetry observability across AKS, EKS and on-prem, and GitOps with ArgoCD.',
  },
  {
    when: '2023 – 2024',
    short: '2023 – 24',
    where: 'IP5 Tecnologia',
    what: 'DevOps Engineer at an IT consultancy serving around 100 Brazilian businesses. Azure, CI/CD and containers for .NET, Angular, Python and Flutter apps.',
  },
  {
    when: '2021 – 2023',
    short: '2021 – 23',
    where: 'Philips (Tasy)',
    what: 'DevOps Engineer on the electronic medical record used by hospitals worldwide. Split one shared dev environment for ~500 developers into per-team environments.',
  },
];

/** Microsoft certifications, most relevant first. */
export const certs = [
  'DevOps Engineer Expert (AZ-400)',
  'Azure Administrator Associate (AZ-104)',
  'Azure Developer Associate (AZ-204)',
  'GitHub Administration (GH-100)',
  'Azure AI Engineer Associate (AI-102)',
  'Fabric Analytics Engineer Associate (DP-600)',
  'Fabric Data Engineer Associate (DP-700)',
  'Azure Fundamentals (AZ-900)',
];

export const BLOG_SINCE = '2022';
