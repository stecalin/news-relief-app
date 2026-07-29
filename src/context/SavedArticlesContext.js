// tracks the logged-in user's saved articles across the whole app
// any component can use useSavedArticles() to check whether a given
// story is saved, and to save/unsave it with one function call

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { subscribeToSavedArticles, saveArticle, unsaveArticle } from '../api/savedArticlesApi';
import { getArticleId } from '../utils/articleId';

const SavedArticlesContext = createContext(null);

export function SavedArticlesProvider({ children }) {
  const { user } = useAuth();
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToSavedArticles(user?.uid, setSavedArticles);
    return unsubscribe;
  }, [user?.uid]);

  // looks up whether a story is currently saved, and returns its saved-doc id if so
  const findSavedEntry = (story) => {
    const articleId = getArticleId(story.sourceUrl);
    return savedArticles.find((entry) => entry.articleId === articleId);
  };

  const isSaved = (story) => Boolean(findSavedEntry(story));

  // saves the story if it isn't saved yet, otherwise removes it
  const toggleSave = async (story) => {
    if (!user) return;

    const existingEntry = findSavedEntry(story);
    if (existingEntry) {
      await unsaveArticle(existingEntry.id);
    } else {
      await saveArticle(user, story);
    }
  };

  return (
    <SavedArticlesContext.Provider value={{ savedArticles, isSaved, toggleSave }}>
      {children}
    </SavedArticlesContext.Provider>
  );
}

export function useSavedArticles() {
  return useContext(SavedArticlesContext);
}