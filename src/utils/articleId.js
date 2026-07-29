// firestore document ids can't contain slashes, so we can't use a raw
// article url as an id directly - this strips it down to something safe

export function getArticleId(url) {
  return url
    .replace(/https?:\/\//, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 300); // firestore ids have a length limit
}