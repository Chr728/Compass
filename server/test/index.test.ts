import request from 'supertest';
import app from './../index';
import admin from '../config/firebase';
import { startServer, stopServer } from '../utils/journalsTestHelper';

beforeAll(() => {
  startServer(); // Start the server before running tests
});

afterAll(() => {
  stopServer(); // Stop the server after all tests are done
});

describe('should test the default route', () => {
  it('returns Hello World!', async () => {
    const decodedToken = {
      uid: 'userUid',
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
    jest
      .spyOn(admin.auth(), 'verifyIdToken')
      .mockResolvedValueOnce(decodedToken);
    const res = await request(app).get('/').set({
      Authorization:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiZXhwIjoxNjMyNjkwMDAwfQ.CbZ57Bh-Rl4-8Fm4wvUwFuEfXv-m_oZ6-DB_n4h_a7c',
    });
    expect(res.text).toBe('Hello World!');
  });
});
