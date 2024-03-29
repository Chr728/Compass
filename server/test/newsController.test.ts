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


describe('GET /api/news', () => {
    it('should return all news', async () => {
        const response = await request(app).get('/api/news');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({ data: expect.any(Array) });
    });

    it('should return 500 if news API fails', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('API failed'));
        const response = await request(app).get('/api/news');
        expect(response.status).toBe(500);
    });
});
