import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  try {
    console.log("Fetching projects...");
    const snap = await getDocs(collection(db, 'projects'));
    console.log("Docs:", snap.docs.length);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
test();
