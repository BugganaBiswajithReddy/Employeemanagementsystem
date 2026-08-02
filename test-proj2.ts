import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId || 'ai-studio-employeemanageme-ec8263c8-e71e-4faf-8ec6-b8b75a59d0db');

async function test() {
  try {
    const snap = await getDocs(collection(db, 'projects'));
    console.log("Projects data:");
    snap.docs.forEach(d => console.log("docId:", d.id, "data:", d.data()));
  } catch (e: any) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
test();
