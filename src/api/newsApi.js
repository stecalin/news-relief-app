// handles all communication with gnews.io
// adds two things on top of a plain fetch: a 15-minute cache (so we don't
// burn through the free tier's rate limit every time a screen re-renders),
// and category filtering (so we get world/national news instead of
// entertainment and sports clutter)

import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dedupeStories } from '../utils/dedupeStories';

const API_KEY = process.env.EXPO_PUBLIC_GNEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4';

const TRUSTED_DOMAINS = [
  'reuters.com',
  'apnews.com',
  'bbc.co.uk',
  'bbc.com',
  'aljazeera.com',
  'washingtonpost.com',
  'npr.org',
];

const BREAKING_WINDOW_HOURS = 12;
const CACHE_TTL_MINUTES = 15;

export function getUserCountryCode() {
  const locales = Localization.getLocales();
  const regionCode = locales?.[0]?.regionCode;
  return regionCode ? regionCode.toLowerCase() : null;
}

// world and nation are the categories closest to general/relief-relevant
// news - this leaves out entertainment, sports, tech, and business noise
export async function fetchByCountry(countryCode) {
  const url = `${BASE_URL}/top-headlines?country=${countryCode}&category=nation&lang=en&max=25&apikey=${API_KEY}`;
  const articles = await fetchWithCache(`country-${countryCode}`, url);
  return dedupeStories(articles);
}

export async function fetchInternational() {
  const url = `${BASE_URL}/top-headlines?category=world&lang=en&max=25&apikey=${API_KEY}`;
  const articles = await fetchWithCache('international', url);

  const trustedOnly = articles.filter((article) =>
    TRUSTED_DOMAINS.some((domain) => article.sourceUrl.includes(domain))
  );

  return dedupeStories(trustedOnly);
}

// checks the cache first - only calls the real api if the cached data
// for this key is missing or older than CACHE_TTL_MINUTES
async function fetchWithCache(cacheKey, url) {
  const storageKey = `news-cache-${cacheKey}`;

  try {
    const cachedRaw = await AsyncStorage.getItem(storageKey);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      const ageMinutes = (Date.now() - cached.fetchedAt) / (1000 * 60);

      if (ageMinutes < CACHE_TTL_MINUTES) {
        return cached.articles;
      }
    }
  } catch {
    // if reading the cache fails for any reason, just fall through to a fresh fetch
  }

  const articles = await fetchAndShape(url);

  try {
    await AsyncStorage.setItem(
      storageKey,
      JSON.stringify({ articles, fetchedAt: Date.now() })
    );
  } catch {
    // if writing the cache fails, it's not worth crashing over - just move on
  }

  return articles;
}

async function fetchAndShape(url) {
  if (!API_KEY) {
    throw new Error('missing gnews api key - check your .env file');
  }

  const response = await fetch(url);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('gnews error response:', response.status, errorBody);
    throw new Error(`gnews request failed with status ${response.status}`);
  }

  const data = await response.json();

  return data.articles
    .filter((article) => article.title)
    .map(shapeArticle);
}

function shapeArticle(article) {
  return {
    id: article.url,
    title: article.title,
    summary: article.description || 'No summary available for this story.',
    imageUrl: article.image || null,
    category: article.source.name,
    publishedAt: article.publishedAt,
    isBreaking: isWithinBreakingWindow(article.publishedAt),
    sourceUrl: article.url,
  };
}

function isWithinBreakingWindow(publishedAt) {
  const hoursSincePublished = (Date.now() - new Date(publishedAt)) / (1000 * 60 * 60);
  return hoursSincePublished <= BREAKING_WINDOW_HOURS;
}