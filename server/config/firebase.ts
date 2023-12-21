import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SA as string);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

export default admin;
