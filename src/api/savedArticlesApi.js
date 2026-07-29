// handles saving/unsaving articles and subscribing to a user's saved list
// each saved article is stored as its own document, tagged with the user
// who saved it and enough story info to display it later without
// needing to re-fetch anything

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { getArticleId } from '../utils/articleId';

// subscribes to real-time updates for a user's saved articles
// calls "callback" every time the list changes, returns an unsubscribe function
export function subscribeToSavedArticles(userId, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const savedQuery = query(
    collection(db, 'savedArticles'),
    where('userId', '==', userId),
    orderBy('savedAt', 'desc')
  );

  return onSnapshot(savedQuery, (snapshot) => {
    const savedArticles = snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...docSnapshot.data(),
    }));
    callback(savedArticles);
  });
}

// saves a story for the given user
export async function saveArticle(user, story) {
  await addDoc(collection(db, 'savedArticles'), {
    userId: user.uid,
    articleId: getArticleId(story.sourceUrl),
    title: story.title,
    summary: story.summary,
    imageUrl: story.imageUrl || null,
    sourceUrl: story.sourceUrl,
    category: story.category,
    publishedAt: story.publishedAt,
    savedAt: serverTimestamp(),
  });
}

// removes a saved article by its saved-document id (not the article id)
export async function unsaveArticle(savedDocId) {
  await deleteDoc(doc(db, 'savedArticles', savedDocId));
}