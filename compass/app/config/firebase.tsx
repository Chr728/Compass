import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA3t-YI76Q_TlYM8Pv0QKNhaFSvxCCoK68',
  authDomain: 'compass-a026e.firebaseapp.com',
  projectId: 'compass-a026e',
  storageBucket: 'compass-a026e.appspot.com',
  messagingSenderId: '834288613549',
  appId: '1:834288613549:web:ce1f9fc023a23029e56e24',
  measurementId: 'G-7KD574QMVM',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
