import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDz8_rsF0WIGPp25mz4IkHPs7E9UPZftYE",
  authDomain: "ripclips-86abe.firebaseapp.com",
  projectId: "ripclips-86abe",
  storageBucket: "ripclips-86abe.firebasestorage.app",
  messagingSenderId: "505229440957",
  appId: "1:505229440957:web:7dbda6c1afefb7fe3f44d4",
  measurementId: "G-03K5NRRG2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth, analytics };