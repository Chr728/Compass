import request from 'supertest';
import app from '../index';
import db from '../models';
import {
    user,
    startServer,
    stopServer,
    mockCreate,
    mockDestroy,
    mockFindAll,
    mockFindOne,
    mockTokenVerification,
    mockUpdate,
    mockRejectedValueOnce,
  } from '../utils/journalsTestHelper';
import { Logger } from "../middlewares/logger";

const healthTip = {
    id: 1,
    uid: 'testuid',
    angertips: "test",
    anxietytips: "test",
    attentiontips:"test",
    depressiontips:"test",
    overwhelmedtips:"test",
    sleeptips:"test",
    tiredtips:"test",
    date: '2023-10-08T10:00:00Z',
    time:"10:00:00",
  };


const mockedDecodedToken = {
    uid: 'testuid',
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



describe('Health Tips Tests', () => {
    beforeAll(() => {
      startServer();
    });
  
    afterAll(() => {
      stopServer();
    });
  
    beforeEach(() => {
      mockTokenVerification(mockedDecodedToken);
      mockFindOne(db.User, user);
    });
  
    afterEach(() => {
      jest.restoreAllMocks();
    });
  
    it('should retrieve the health tip entry', async () => {
     mockFindOne(db.HealthTips, healthTip);

  
      const res = await request(app)
        .get(`/api/healthtips/${user.uid}`)
        .set({ Authorization: 'Bearer token' });
  
      expect(db.HealthTips.findOne).toBeCalledTimes(1);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('SUCCESS');
      expect(res.body.data).toEqual(healthTip);
    });

    it("should sent a error if health tip is not found", async () => {
        mockFindOne(db.HealthTips, null);

        const res = await request(app)
        .get(`/api/healthtips/${user.uid}`)
        .set({ Authorization: 'Bearer token' });
        expect(res.status).toBe(404);
    })


})