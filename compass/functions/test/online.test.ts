require('dotenv').config()
import {helloWorld} from "../src/index";
import {makeEmailLowercase} from "../src/index";

const testEnv = require('firebase-functions-test')({
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    projectId: process.env.FIREBASE_PROJECT_ID,
}, process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

describe('helloWorld', () => {
    afterAll(() => {
        testEnv.cleanup();
    });
    it('should return "Hello from Firebase!"', () => {
        const req = {};
        const res = {
            send: jest.fn(),
        };
        helloWorld(req as any, res as any);

        expect(res.send).toHaveBeenCalledWith('Hello from Firebase!');
    });
});


describe('Test Firestore Functions', () => {
    afterAll(() => {
        testEnv.cleanup();
    });
    it('should make email lowercase', async () => {
        const wrapped = testEnv.wrap(makeEmailLowercase);
        const snap = testEnv.firestore.makeDocumentSnapshot(
            {email: 'TEST@GMAIL.COM'}, 'Users/TEST');
        await wrapped(snap);
        const data = (await snap.ref.get()).data();
        expect(data.email).toBe('test@gmail.com');
        await snap.ref.delete();
})
});
