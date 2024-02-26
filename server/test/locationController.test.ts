import request from 'supertest';
import app from './../index';
import admin from '../config/firebase';
import {mockTokenVerification, startServer, stopServer} from '../utils/journalsTestHelper';

const mockedDecodedToken = {
    uid: 'uid',
    aud: '',
    auth_time: 0,
    exp: 0,
    firebase: {
        identities: { [0]: 'string' },
        sign_in_provider: 'string',
    },
    iat: 0,
    iss: '',
    sub: '',
};

beforeAll(() => {
    startServer(); // Start the server before running tests
});

afterAll(() => {
    stopServer(); // Stop the server after all tests are done
});

beforeEach(() => {
    mockTokenVerification(mockedDecodedToken);
});

afterEach(() => {
    jest.restoreAllMocks();
});


describe('GET /api/locations', () => {
    it('should return 400 if latitude, longitude or type is missing', async () => {
        const response = await request(app)
            .get('/api/locations?latitude=6.5244')
            .set({ Authorization: 'Bearer token' });
        expect(response.status).toBe(400);
    });

    it('should return 200 if latitude, longitude and type are provided', async () => {
        const response = await request(app)
            .get('/api/locations?latitude=6.5244&longitude=3.3792&type=hospital')
            .set({ Authorization: 'Bearer token' });
        expect(response.status).toBe(200);
    });


});


