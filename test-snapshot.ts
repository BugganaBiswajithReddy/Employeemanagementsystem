import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const unsub = onSnapshot(collection(db, 'projects'), 
  (snap) => {
    console.log("Snapshot Docs:", snap.docs.length);
    unsub();
    process.exit(0);
  }, 
  (err) => {
    console.error("Snapshot Error:", err.message);
    process.exit(1);
  }
);
