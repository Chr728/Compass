import admin from "../config/firebase";

const generateToken = async (uid: string) => {
    try {
        const token = await admin.auth().createCustomToken(uid);
        console.log('Custom token:', token);
    } catch (error) {
        console.error('Error generating custom token:', error);
    }
};

// Get the UID from the command-line arguments
const uid = process.argv[2];

if (!uid) {
    console.error('Please provide a UID as a command-line argument.');
} else {
    generateToken(uid);
}
