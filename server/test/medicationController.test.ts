import request from 'supertest';
import app from '../index';
import db from '../models/index';
import admin from 'firebase-admin';

let server: any;
const port = process.env.SERVER_DEV_PORT;

const user = {
    id: 1,
    uid: 'uid',
    email: 'test@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '5149826382',
    birthDate: '2000-10-12',
    sex: 'male',
  };

  const medications = [
    {
        id: 1,
        uid: 'medicationUid',
        medicationName: 'newMedication111',
        dateStarted: '2002-02-22',
        time: '14:30:00',
        dosage: 12,
        unit: 'medicationUnit111',
        frequency: 'frequency111',
        route: 'route',
        notes: ''
    },
    {
        id: 2,
        uid: 'nextMedicationUid',
        medicationName: 'newMedication222',
        dateStarted: '2002-09-22',
        time: '12:30:00',
        dosage: 8,
        unit: 'medicationUnit222',
        frequency: 'frequency222',
        route: 'route222',
        notes: 'notes'}
]

const createMedication =
    {
        id: 1,
        uid: 'medicationUid',
        medicationName: 'newMedication111',
        dateStarted: '2002-02-22',
        time: '14:30:00',
        dosage: 12,
        unit: 'medicationUnit111',
        frequency: 'frequency111',
        route: 'route',
        notes: ''
    }

    const mockedDecodedToken = {
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

    function startServer() {
        server = app.listen(port);
      }
    
      function stopServer() {
        if (server) {
          server.close();
        }
      }
    
      beforeAll(() => {
        startServer(); // Start the server before running tests
      });
    
      afterAll(() => {
        stopServer(); // Stop the server after all tests are done
      });
    
      beforeEach(() => {
        jest
          .spyOn(admin.auth(), 'verifyIdToken')
          .mockResolvedValueOnce(mockedDecodedToken);
      });
    
        afterEach(() => {
        jest.restoreAllMocks();
      });

      describe('Testing the create medication controller', () => {
        it('test to create medication', async () => {
          jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
          jest.spyOn(db.Medication, 'create').mockResolvedValueOnce(createMedication);
          const res = await request(app)
            .post('/api/medication/user/uid')
            .send(createMedication)
            .set({ Authorization: 'Bearer token' });
          expect(db.User.findOne).toHaveBeenCalledTimes(1);
          expect(db.Medication.create).toHaveBeenCalledTimes(1);
          expect(res.status).toBe(201);
          expect(res.body.status).toBe('SUCCESS');
          expect(res.body.data).toStrictEqual(createMedication);
        });
    
        it('test the error if the user uid passed is invalid', async () => {
            jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(db.Medication, 'create').mockResolvedValueOnce(createMedication);
            const res = await request(app)
              .post('/api/medication/user/uid')
              .send(createMedication)
              .set({ Authorization: 'Bearer token' });
            expect(db.User.findOne).toHaveBeenCalledTimes(1);
            expect(db.Medication.create).toHaveBeenCalledTimes(0);
            expect(res.status).toBe(404);
            expect(res.body.status).toBe('ERROR');
            expect(res.body.message).toBe(
                'User not found, invalid user uid.'
              );
          });
    
        it('should catch the unexpected error', async () => {
          jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
          jest.spyOn(db.Medication, 'create').mockRejectedValue(new Error('query error'));
          const res = await request(app)
            .post('/api/medication/user/uid')
            .send('')
            .set({ Authorization: 'Bearer token' });
          expect(db.Medication.create).toHaveBeenCalledTimes(1);
          expect(res.status).toBe(400);
          expect(res.body.status).toBe('ERROR');
        });
      });

      describe('Testing the get all medications controller', () => {
        it('test to get all medications', async () => {
          jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
          jest.spyOn(db.Medication, 'findAll').mockResolvedValueOnce(medications);
          const res = await request(app)
            .get('/api/medication/user/uid')
            .send('')
            .set({ Authorization: 'Bearer token' });
          expect(db.User.findOne).toHaveBeenCalledTimes(1);
          expect(db.Medication.findAll).toHaveBeenCalledTimes(1);
          expect(res.status).toBe(200);
          expect(res.body.status).toBe('SUCCESS');
          expect(res.body.data).toStrictEqual(medications);
        });
    
        it('test the error if the user uid passed is invalid', async () => {
            jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
            jest.spyOn(db.Medication, 'findAll').mockResolvedValueOnce(medications);
            const res = await request(app)
              .get('/api/medication/user/uid')
              .send('')
              .set({ Authorization: 'Bearer token' });
            expect(db.User.findOne).toHaveBeenCalledTimes(1);
            expect(db.Medication.findAll).toHaveBeenCalledTimes(0);
            expect(res.status).toBe(404);
            expect(res.body.status).toBe('ERROR');
            expect(res.body.message).toBe(
                'User not found, invalid user uid.'
              );
          });
    
        it('should catch the error', async () => {
          jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
          jest.spyOn(db.Medication, 'findAll').mockRejectedValue(new Error('query error'));
          const res = await request(app)
            .get('/api/medication/user/uid')
            .send('')
            .set({ Authorization: 'Bearer token' });
          expect(db.User.findOne).toHaveBeenCalledTimes(1);
          expect(db.Medication.findAll).toHaveBeenCalledTimes(1);
          expect(res.status).toBe(400);
          expect(res.body.status).toBe('ERROR');
        });
      });

      describe('Testing the get one medication controller', () => {
        it('test to get one medication', async () => {
          jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(medications[0]);
          const res = await request(app)
            .get(`/api/medication/1`)
            .set({ Authorization: 'Bearer token' });
          expect(db.Medication.findOne).toHaveBeenCalledTimes(1);
          expect(res.status).toBe(200);
          expect(res.body.status).toBe('SUCCESS');
          expect(res.body.data).toStrictEqual(medications[0]);
        });
    
        it('test the error if the medication id passed is invalid', async () => {
            jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(null);
            const res = await request(app)
              .get('/api/medication/1')
              .set({ Authorization: 'Bearer token' });
            expect(db.Medication.findOne).toHaveBeenCalledTimes(1);
            expect(res.status).toBe(404);
            expect(res.body.status).toBe('ERROR');
            expect(res.body.message).toBe(
                'Medication not found, invalid medication id.'
              );
          });
    
        it('should catch the error', async () => {
          jest.spyOn(db.Medication, 'findOne').mockRejectedValue(new Error('query error'));
          const res = await request(app)
            .get('/api/medication/1')
            .set({ Authorization: 'Bearer token' });
          expect(db.Medication.findOne).toHaveBeenCalledTimes(1);
          expect(res.status).toBe(400);
          expect(res.body.status).toBe('ERROR');
        });
      });