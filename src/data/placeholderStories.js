// fake story data so we can build and see the ui before connecting real news
// once the feed looks right, we'll swap this out for a live api call

export const placeholderStories = [
  {
    id: '1',
    title: 'Wildfires spread across southern region, thousands evacuated',
    summary: 'Fast-moving fires have forced entire towns to leave their homes as crews battle high winds.',
    imageUrl: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=800',
    category: 'Climate',
    isBreaking: true,
    publishedAt: '2026-07-27T14:30:00Z',
  },
  {
    id: '2',
    title: 'Humanitarian corridors expanded to reach displaced families',
    summary: 'Aid groups report improved access to deliver food and medical supplies this week.',
    imageUrl: 'https://images.unsplash.com/photo-1541873676-a18131494184?w=800',
    category: 'Humanitarian',
    isBreaking: true,
    publishedAt: '2026-07-27T11:15:00Z',
  },
  {
    id: '3',
    title: 'Flood recovery continues months after historic storm',
    summary: 'Communities are still rebuilding, with volunteer groups reporting ongoing need for supplies.',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800',
    category: 'Disaster Relief',
    isBreaking: false,
    publishedAt: '2026-07-20T09:00:00Z',
  },
  {
    id: '4',
    title: 'Refugee support programs face funding shortfall',
    summary: 'Organizations warn that shelters and food programs may be forced to scale back services.',
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
    category: 'Humanitarian',
    isBreaking: false,
    publishedAt: '2026-07-15T16:45:00Z',
  },
];