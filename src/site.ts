/** Site-wide settings and identity. */
export const SITE = {
  brand: '~/captain-devops',
  name: 'Bernardo Mesko',
  role: 'Platform Engineer',
  description:
    'Bernardo Mesko, Platform Engineer from Brazil. Golden paths, GitOps and observability on Kubernetes, Terraform and Azure, and the infrastructure that puts AI agents into production.',
  /** Active type pairing class; keep in sync with src/styles/fonts.css. */
  typePairing: 'type-chart',
};

/** Contact and profile links. */
export const LINKS = {
  github: 'https://github.com/Bemesko',
  linkedin: 'https://www.linkedin.com/in/bemesko/',
  email: 'mailto:bemesko@gmail.com',
  blog: 'https://captaindevops.substack.com',
  wca: 'https://worldcubeassociation.org/persons/2019MESK01',
};

/** Ordered list of contact links for the contact sections. */
export const CONTACT = [
  { label: 'LinkedIn', href: LINKS.linkedin },
  { label: 'GitHub', href: LINKS.github },
  { label: 'Email', href: LINKS.email },
  { label: "Blog · Captain DevOps' Notes", href: LINKS.blog },
];
