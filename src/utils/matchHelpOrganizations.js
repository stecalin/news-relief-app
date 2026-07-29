// matches a story to relevant relief organizations by checking whether
// any of an organization's keywords appear in the story's title or summary

import { reliefOrganizations, defaultOrganizationIds } from '../data/reliefOrganizations';

export function matchHelpOrganizations(story) {
  const storyText = `${story.title} ${story.summary}`.toLowerCase();

  const matched = reliefOrganizations.filter((org) =>
    org.keywords.some((keyword) => storyText.includes(keyword))
  );

  if (matched.length > 0) {
    return matched;
  }

  // no keyword matches - fall back to a small set of general-purpose orgs
  return reliefOrganizations.filter((org) => defaultOrganizationIds.includes(org.id));
}