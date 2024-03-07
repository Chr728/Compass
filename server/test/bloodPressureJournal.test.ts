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

const bloodPressureJournal = {
    id: 10,
    uid: 'testuid',
    date: '2020-12-31T00:00:00.000Z',
    time: '08:00',
    systolic: 120,
    diastolic: 80,
    pulse: 70,
    notes: 'test',
};

const invalidbloodPressureJournal = {
    id: 10,
    uid: 'testuid',
    date: '2020-12-31T00:00:00.000Z',
    time: '08:00',
    systolic: 'string',
    diastolic: 'string',
    pulse: 70,
};

const updatedbloodPressureJournal = {
    id: 10,
    uid: 'testuid',
    date: '2020-12-31T00:00:00.000Z',
    time: '10:00',
    systolic: 130,
    diastolic: 90,
    pulse: 80,
    notes: 'updated test',
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

beforeAll(() => {
    startServer();
});

afterAll(() => {
    stopServer();
});

beforeEach(() => {
    mockTokenVerification(mockedDecodedToken);
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('Testing the create bloodPressureJournals controller', () => {
    it('test to create a bloodPressureJournal journal', async () => {
        mockFindOne(db.User, user);
        mockCreate(db.BloodPressureJournal, bloodPressureJournal);

        const res = await request(app)
            .post(`/api/journals/bloodPressure/user/${user.uid}`)
            .send(bloodPressureJournal)
            .set({ Authorization: 'Bearer token' });

        expect(db.User.findOne).toHaveBeenCalledTimes(1);
        expect(db.BloodPressureJournal.create).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(201);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toStrictEqual(bloodPressureJournal);
    });
    it('test the error if the user uid passed is invalid', async () => {
        mockFindOne(db.User, null);
        mockCreate(db.BloodPressureJournal, bloodPressureJournal);

        const res = await request(app)
            .post(`/api/journals/bloodPressure/user/${user.uid}`)
            .send(bloodPressureJournal)
            .set({ Authorization: 'Bearer token' });
        expect(db.User.findOne).toHaveBeenCalledTimes(1);
        expect(db.BloodPressureJournal.create).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('NOT_FOUND');
        expect(res.body.message).toBe('User not found');
    });

    it('test the error if request is not made properly', async () => {
        mockFindOne(db.User, user);
        mockRejectedValueOnce(
            'create',
            db.BloodPressureJournal,
            new Error('query error')
        );

        const res = await request(app)
            .post(`/api/journals/bloodPressure/user/${user.uid}`)
            .send(bloodPressureJournal)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.create).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
    });

    it('test the error if the data is invalid', async () => {
        mockFindOne(db.User, user);
        mockRejectedValueOnce(
            'create',
            db.BloodPressureJournal,
            bloodPressureJournal
        );

        const res = await request(app)
            .post(`/api/journals/bloodPressure/user/${user.uid}`)
            .send(invalidbloodPressureJournal)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.create).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
    });
});

describe('Testing the update bloodPressureJournal controller', () => {
    it('should update an blood pressure journal for a user', async () => {
        mockFindOne(db.BloodPressureJournal, bloodPressureJournal);
        mockUpdate(db.BloodPressureJournal, updatedbloodPressureJournal);
        mockFindOne(db.BloodPressureJournal, updatedbloodPressureJournal);

        const res = await request(app)
            .put(`/api/journals/bloodPressure/${bloodPressureJournal.id}`)
            .send(updatedbloodPressureJournal)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.findOne).toBeCalledTimes(2);
        expect(db.BloodPressureJournal.update).toBeCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toEqual(updatedbloodPressureJournal);
    });

    it('should return an error if the journal is not found ', async () => {
        mockFindOne(db.BloodPressureJournal, null);
        mockUpdate(db.BloodPressureJournal, [1]);

        const res = await request(app)
            .put(`/api/journals/bloodPressure/${bloodPressureJournal.id}`)
            .send(bloodPressureJournal)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.findOne).toHaveBeenCalledTimes(1);
        expect(db.BloodPressureJournal.update).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('NOT_FOUND');
        expect(res.body.message).toBe('Blood pressure journal not found');
    });

    it('should return an error updating the journal', async () => {
        mockFindOne(db.BloodPressureJournal, bloodPressureJournal);
        mockRejectedValueOnce(
            'update',
            db.BloodPressureJournal,
            new Error('query error')
        );

        const res = await request(app)
            .put(`/api/journals/bloodPressure/${bloodPressureJournal.id}`)
            .send(bloodPressureJournal)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.findOne).toHaveBeenCalledTimes(1);
        expect(db.BloodPressureJournal.update).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
    });

    it('should return an error if the data is invalid when updating the journal', async () => {
        mockFindOne(db.BloodPressureJournal, bloodPressureJournal);
        mockRejectedValueOnce(
            'update',
            db.BloodPressureJournal,
            updatedbloodPressureJournal
        );

        const res = await request(app)
            .put(`/api/journals/bloodPressure/${bloodPressureJournal.id}`)
            .send(invalidbloodPressureJournal)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.findOne).toHaveBeenCalledTimes(1);
        expect(db.BloodPressureJournal.update).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
    });
});

describe('Testing the delete bloodPressureJournal controller', () => {
    it('should delete a bloodPressureJournal journal for a user', async () => {
        mockFindOne(db.BloodPressureJournal, bloodPressureJournal);
        mockDestroy(db.BloodPressureJournal, bloodPressureJournal);

        const res = await request(app)
            .delete(`/api/journals/bloodPressure/${bloodPressureJournal.id}`)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.findOne).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUCCESS');
    });

    it('should return an error if the journal is not found ', async () => {
        mockFindOne(db.BloodPressureJournal, null);
        mockDestroy(db.BloodPressureJournal, 1);

        const res = await request(app)
            .delete(`/api/journals/bloodPressure/${bloodPressureJournal.id}`)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.findOne).toHaveBeenCalledTimes(1);
        expect(db.BloodPressureJournal.destroy).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('NOT_FOUND');
        expect(res.body.message).toBe('Blood pressure journal not found');
    });

    it('should return an error deleting the journal', async () => {
        mockFindOne(db.BloodPressureJournal, bloodPressureJournal);
        mockRejectedValueOnce(
            'destroy',
            db.BloodPressureJournal,
            new Error('query error')
        );

        const res = await request(app)
            .delete(`/api/journals/bloodPressure/${bloodPressureJournal.id}`)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.findOne).toHaveBeenCalledTimes(1);
        expect(db.BloodPressureJournal.destroy).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
    });
});

describe('Testing the get bloodPressureJournal controller', () => {
    it('should get a blood pressure journal for a user', async () => {
        mockFindOne(db.BloodPressureJournal, bloodPressureJournal);

        const res = await request(app)
            .get(`/api/journals/bloodPressure/${bloodPressureJournal.id}`)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.findOne).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toEqual(bloodPressureJournal);
    });

    it('should return an error if the journal is not found ', async () => {
        mockFindOne(db.BloodPressureJournal, null);

        const res = await request(app)
            .get(`/api/journals/bloodPressure/${bloodPressureJournal.id}`)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.findOne).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('NOT_FOUND');
        expect(res.body.message).toBe('Blood pressure journal not found');
    });

    it('should return an error getting the journal', async () => {
        mockRejectedValueOnce(
            'findOne',
            db.BloodPressureJournal,
            new Error('query error')
        );

        const res = await request(app)
            .get(`/api/journals/bloodPressure/${bloodPressureJournal.id}`)
            .set({ Authorization: 'Bearer token' });

        expect(db.BloodPressureJournal.findOne).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
    });
});

describe('Testing the get bloodPressureJournals controller', () => {
    it('should get all blood pressure journals for a user', async () => {
        mockFindOne(db.User, user);
        mockFindAll(db.BloodPressureJournal, [bloodPressureJournal]);

        const res = await request(app)
            .get(`/api/journals/bloodPressure/user/${user.uid}`)
            .set({ Authorization: 'Bearer token' });

        expect(db.User.findOne).toHaveBeenCalledTimes(1);
        expect(db.BloodPressureJournal.findAll).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toEqual([bloodPressureJournal]);
    });

    it('should return an error if the user is not found ', async () => {
        mockFindOne(db.User, null);

        const res = await request(app)
            .get(`/api/journals/bloodPressure/user/${user.uid}`)
            .set({ Authorization: 'Bearer token' });

        expect(db.User.findOne).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('NOT_FOUND');
        expect(res.body.message).toBe('User not found');
    });

    it('should return an error getting the journals', async () => {
        mockFindOne(db.User, user);
        mockRejectedValueOnce(
            'findAll',
            db.BloodPressureJournal,
            new Error('query error')
        );

        const res = await request(app)
            .get(`/api/journals/bloodPressure/user/${user.uid}`)
            .set({ Authorization: 'Bearer token' });

        expect(db.User.findOne).toHaveBeenCalledTimes(1);
        expect(db.BloodPressureJournal.findAll).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
    });
});
