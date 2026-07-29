// tracks the currently logged-in user across the whole app, and exposes
// sign up / sign in / sign out functions - any screen can pull these in
// with the useAuth() hook below instead of talking to firebase directly

import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // firebase calls this automatically whenever login state changes
  // (app opens, user logs in, user logs out, etc)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logOut = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isCheckingAuth, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// convenience hook so screens can just do: const { user, logIn } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}