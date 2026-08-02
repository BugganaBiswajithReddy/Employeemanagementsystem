import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  try {
    console.log("Writing project...");
    await setDoc(doc(db, 'projects', 'test1'), { name: 'Test Project' });
    console.log("Success");
  } catch (e: any) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
test();
