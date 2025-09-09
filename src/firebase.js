// firebase.js
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app) // 👈 add this


/* IN FIREBASE -> RULES
  rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ⚠️ TEMP: Allow anyone to read/write
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

CHANGE IT LATER WHEN IN PRODUCTION TO

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow only authenticated users to read/write packages
    match /packages/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}

*/