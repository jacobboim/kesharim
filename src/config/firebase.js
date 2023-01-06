import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // apiKey: "AIzaSyBaZ73kqrgxtFgv1tVBK7jL_AdeRAtIxrM",
  // authDomain: "spotitexpo.firebaseapp.com",
  // projectId: "spotitexpo",
  // storageBucket: "spotitexpo.appspot.com",
  // messagingSenderId: "99100078447",
  // appId: "1:99100078447:web:7eda7278793e43b18cf89a",

  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
export const db = getFirestore();
