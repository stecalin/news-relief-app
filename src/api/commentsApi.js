// handles all comment reading/writing with firestore
// comments are stored in one top-level "comments" collection, with each
// comment tagged by which article it belongs to (rather than a separate
// sub-collection per article, which keeps things simpler to query)

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

// subscribes to real-time updates for a single article's comments
// calls "callback" every time comments change, and returns an unsubscribe
// function to call when the screen unmounts
export function subscribeToComments(articleId, callback) {
  const commentsQuery = query(
    collection(db, 'comments'),
    where('articleId', '==', articleId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(commentsQuery, (snapshot) => {
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(comments);
  });
}

// posts a new comment, tagged with the article it belongs to and the
// logged-in user who wrote it
export async function postComment({ articleId, text, user }) {
  await addDoc(collection(db, 'comments'), {
    articleId,
    text,
    userId: user.uid,
    userEmail: user.email,
    createdAt: serverTimestamp(),
  });
}

// deletes a comment - firestore's security rules already enforce that only
// the original author can do this, so we don't need to double check here
export async function deleteComment(commentId) {
  await deleteDoc(doc(db, 'comments', commentId));
}