import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

console.log("INITIALIZING FIREBASE WITH CONFIG:", firebaseConfig);

export const app = initializeApp(firebaseConfig);
// Default to the provided ID, or explicitly specify it just to be absolutely sure
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || 'ai-studio-employeemanageme-ec8263c8-e71e-4faf-8ec6-b8b75a59d0db');

