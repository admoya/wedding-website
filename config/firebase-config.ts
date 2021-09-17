const config: import("@firebase/app").FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "moya-wedding.firebaseapp.com",
  databaseURL: "https://moya-wedding-default-rtdb.firebaseio.com",
  projectId: "moya-wedding",
  storageBucket: "moya-wedding.appspot.com",
  messagingSenderId: "406151049516",
  appId: "1:406151049516:web:40fbe179a2baa1d9bb3c89"
};
export default config;