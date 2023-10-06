import admin from 'firebase-admin';
const path = require('path');
const serviceAccount = require(path.resolve(__dirname,'../serviceAccountKey.json'))

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

export default admin;
