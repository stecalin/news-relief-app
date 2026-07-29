// removes duplicate stories - keeps the first occurrence of any headline
// that normalizes down to the same text, so the same event reported by
// two outlets with near-identical wording doesn't show up twice

export function dedupeStories(stories) {
  const seenTitles = new Set();
  const uniqueStories = [];

  for (const story of stories) {
    const normalizedTitle = normalize(story.title);

    if (!seenTitles.has(normalizedTitle)) {
      seenTitles.add(normalizedTitle);
      uniqueStories.push(story);
    }
  }

  return uniqueStories;
}

// strips punctuation and extra whitespace, lowercases everything, so
// "Wildfire Spreads!" and "wildfire spreads" are treated as the same story
function normalize(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}