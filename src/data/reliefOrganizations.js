// a hand-curated list of real, well-established relief and humanitarian
// organizations - not ai-generated, so every name and link here is
// something we've deliberately chosen and can vouch for
//
// "keywords" are matched against a story's title and summary to decide
// which organizations are relevant to which stories

export const reliefOrganizations = [
  {
    id: 'red-cross',
    name: 'American Red Cross',
    description: 'Emergency shelter, supplies, and support after disasters like fires, floods, and storms.',
    url: 'https://www.redcross.org',
    keywords: ['wildfire', 'fire', 'flood', 'storm', 'hurricane', 'tornado', 'disaster', 'evacuate', 'evacuation'],
  },
  {
    id: 'direct-relief',
    name: 'Direct Relief',
    description: 'Delivers medical supplies and support to communities affected by disasters and poverty.',
    url: 'https://www.directrelief.org',
    keywords: ['disaster', 'earthquake', 'flood', 'wildfire', 'hurricane', 'medical', 'hospital', 'health'],
  },
  {
    id: 'unhcr',
    name: 'UNHCR, the UN Refugee Agency',
    description: 'Protects and supports people forcibly displaced by conflict and persecution worldwide.',
    url: 'https://www.unhcr.org',
    keywords: ['refugee', 'displaced', 'displacement', 'asylum', 'border crossing'],
  },
  {
    id: 'wfp',
    name: 'World Food Programme',
    description: 'Provides emergency food assistance in famine, conflict, and crisis zones.',
    url: 'https://www.wfp.org',
    keywords: ['famine', 'hunger', 'starvation', 'food crisis', 'malnutrition'],
  },
  {
    id: 'msf',
    name: 'Doctors Without Borders (MSF)',
    description: 'Delivers emergency medical care in conflict zones and disaster areas around the world.',
    url: 'https://www.doctorswithoutborders.org',
    keywords: ['conflict', 'war', 'gaza', 'ukraine', 'sudan', 'earthquake', 'medical', 'hospital'],
  },
  {
    id: 'icrc',
    name: 'International Committee of the Red Cross',
    description: 'Provides humanitarian protection and assistance for victims of armed conflict.',
    url: 'https://www.icrc.org',
    keywords: ['conflict', 'war', 'ceasefire', 'prisoner', 'armed forces', 'humanitarian corridor'],
  },
  {
    id: 'unicef',
    name: 'UNICEF',
    description: 'Supports children and families affected by conflict, disaster, and poverty worldwide.',
    url: 'https://www.unicef.org',
    keywords: ['children', 'child', 'school', 'family', 'families', 'orphan'],
  },
  {
    id: 'climate-nature-conservancy',
    name: 'The Nature Conservancy',
    description: 'Works on climate change solutions, from wildfire prevention to reforestation.',
    url: 'https://www.nature.org',
    keywords: ['climate', 'wildfire', 'drought', 'emissions', 'deforestation', 'environment'],
  },
  {
    id: 'giving-compass-general',
    name: 'Charity Navigator',
    description: 'Independent charity evaluator - a reliable way to research and vet any relief organization before donating.',
    url: 'https://www.charitynavigator.org',
    keywords: [], // shown as a fallback for any story, regardless of topic
  },
];

// how relief organizations are shown for stories with no direct keyword
// match - a small, general-purpose set rather than nothing at all
export const defaultOrganizationIds = ['red-cross', 'direct-relief', 'giving-compass-general'];