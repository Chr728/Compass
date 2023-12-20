import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SA as string))
})

export default admin;
