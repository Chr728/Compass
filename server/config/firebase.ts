import admin from 'firebase-admin';
// const path = require('path');
// const serviceAccount = require(path.resolve(__dirname,'../serviceAccountKey.json'))

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SA as string))
})

export default admin;
