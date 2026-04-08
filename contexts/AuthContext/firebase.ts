import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_KEY,
  authDomain: "auth.cipherwill.com",
  projectId: "project-cipherwill",
  storageBucket: "project-cipherwill.appspot.com",
  messagingSenderId: "200526322095",
  appId: "1:200526322095:web:adedd3c4f769d6d9a3775a",
  measurementId: "G-HET0PM9EPK",
};

const app = initializeApp(firebaseConfig, "project-cipherwill");

export const authApp = getAuth(app);

export const privateRoutes = [
  "/app",
  "/executor",
];
