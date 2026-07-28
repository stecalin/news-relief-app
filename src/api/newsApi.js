// handles all communication with newsapi.org
// this file fetches three separate feeds - the user's own country, the us,
// and a fixed set of trusted international wire services - and hands back
// stories already shaped for the rest of the app to use

import * as Localization from 'expo-localization';

const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

// hand-picked list of established, reliable wire services and outlets
// (full list of valid source ids: https://newsapi.org/sources)
const INTERNATIONAL_SOURCES = [
  'associated-press',
  'reuters',
  'bbc-news',
  'al-jazeera-english',
  'the-washington-post',
  'npr',
].join(',');

// how recent a story needs to be (in hours) to count as "breaking"
const BREAKING_WINDOW_HOURS = 6;

// figures out the user's country code from their device settings
// returns something like "us", "gb", "ca" - or null if it can't be determined
export function getUserCountryCode() {
  const locales = Localization.getLocales();
  const regionCode = locales?.[0]?.regionCode;
  return regionCode ? regionCode.toLowerCase() : null;
}

// fetches top headlines for a specific country
// (newsapi only supports a limited list of countries - if this fails,
// the screen just won't show a "your country" tab)
export async function fetchByCountry(countryCode) {
  const url = `${BASE_URL}/top-headlines?country=${countryCode}&pageSize=20&apiKey=${API_KEY}`;
  return fetchAndShape(url);
}

// fetches from our fixed list of trusted international wire services
export async function fetchInternational() {
  const url = `${BASE_URL}/top-headlines?sources=${INTERNATIONAL_SOURCES}&pageSize=20&apiKey=${API_KEY}`;
  return fetchAndShape(url);
}

// shared logic for hitting the api and converting the response
// into the story shape our components expect
async function fetchAndShape(url) {
  if (!API_KEY) {
    throw new Error('missing news api key - check your .env file');
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`news api request failed with status ${response.status}`);
  }

  const data = await response.json();

  return data.articles
    .filter((article) => article.title && article.title !== '[Removed]')
    .map(shapeArticle);
}

// converts one raw newsapi article into our app's story format
function shapeArticle(article) {
  return {
    id: article.url,
    title: article.title,
    summary: article.description || 'No summary available for this story.',
    imageUrl: article.urlToImage || null,
    category: article.source.name,
    publishedAt: article.publishedAt,
    isBreaking: isWithinBreakingWindow(article.publishedAt),
    sourceUrl: article.url,
  };
}

// checks whether a timestamp falls inside our "breaking" window
function isWithinBreakingWindow(publishedAt) {
  const hoursSincePublished = (Date.now() - new Date(publishedAt)) / (1000 * 60 * 60);
  return hoursSincePublished <= BREAKING_WINDOW_HOURS;
}