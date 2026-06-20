export const mockUsers = [
  { id: 'u1', email: 'founder@example.com', password: 'password', role: 'founder', name: 'Alice Founder' },
  { id: 'u2', email: 'investor@example.com', password: 'password', role: 'investor', name: 'Bob Investor' }
];

export const mockStartups = [
  {
    id: 's1',
    founderId: 'u1',
    name: 'TechFlow AI',
    tagline: 'Automating workflows with generative AI',
    industry: 'SaaS / AI',
    stage: 'Seed',
    location: 'San Francisco, CA',
    score: 85,
    metrics: { arr: '$150k', growth: '15% MoM', runway: '12 months' },
    description: 'TechFlow AI helps enterprises automate their document workflows using advanced LLMs.',
    savedBy: []
  },
  {
    id: 's2',
    founderId: 'u3',
    name: 'GreenEnergy Tech',
    tagline: 'Next-gen solar storage',
    industry: 'CleanTech',
    stage: 'Series A',
    location: 'Austin, TX',
    score: 92,
    metrics: { arr: '$1.2M', growth: '5% MoM', runway: '24 months' },
    description: 'Developing high-density battery storage for solar grids.',
    savedBy: ['u2']
  },
  {
    id: 's3',
    founderId: 'u4',
    name: 'MediSync',
    tagline: 'Unified patient records',
    industry: 'HealthTech',
    stage: 'Pre-Seed',
    location: 'Boston, MA',
    score: 74,
    metrics: { arr: '$0', growth: 'N/A', runway: '8 months' },
    description: 'A platform connecting disparate EHR systems into a single patient timeline.',
    savedBy: []
  }
];
