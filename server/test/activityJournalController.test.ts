import request from 'supertest';
import app from '../index';
import db from '../models';

let server: any;
const port = process.env.SERVER_DEV_PORT;

const user = {
    id: 10,
    uid: 'testuid',
    email: 'test@gmail.com',
    firstName: 'John',
    lastName: 'Doe',
    streetAddress: '1234 Street',
    city: 'Montreal',
    province: 'Quebec',
    postalCode: 'H4M 2M9',
    phoneNumber: '5147894561',
    birthDate: '1990-12-31T00:00:00.000Z',
    sex: 'male',
};

const activityJournal = {
    id: 1,
    uid: 'testuid',
    date: '2023-09-30',
    time: '12:00:00',
    activity: 'running',
    duration: 175,
    notes: 'Sample activity entry',
};

const updatedActivityJournal = {
    date: '2023-09-30',
    time: '12:00:00',
    activity: 70,
    duration: 175,
    notes: 'Sample activity entry',
};

function startServer() {
    server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

function stopServer() {
    if (server) {
        server.close(() => {
            console.log('Server stopped');
        });
    }
}

describe('activity Journal Controller Tests', () => {
    beforeAll(() => {
        startServer();
    });

    afterAll(() => {
        stopServer();
    });

    beforeEach(() => {
        jest.spyOn(db.User, 'findOne').mockResolvedValue(user);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should get activity journals for a user', async () => {
        jest
            .spyOn(db.ActivityJournal, 'findAll')
            .mockResolvedValueOnce([activityJournal]);

        const res = await request(app).get(`/api/journals/activity/user/${user.uid}`);

        expect(db.User.findOne).toBeCalledTimes(1);
        expect(db.ActivityJournal.findAll).toBeCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toEqual([activityJournal]);
    });

    it('should get a activity journal for a user', async () => {
        jest
            .spyOn(db.ActivityJournal, 'findOne')
            .mockResolvedValueOnce(activityJournal);

        const res = await request(app).get(
            `/api/journals/activity/${activityJournal.id}`
        );

        expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toEqual(activityJournal);
    });

    it('should create a activity journal for a user', async () => {
        jest.spyOn(db.ActivityJournal, 'create').mockResolvedValueOnce(activityJournal);

        const res = await request(app)
            .post(`/api/journals/activity/user/${user.uid}`)
            .send(activityJournal);

        expect(db.User.findOne).toBeCalledTimes(1);
        expect(db.ActivityJournal.create).toBeCalledTimes(1);
        expect(res.status).toBe(201);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toEqual(activityJournal);
    });

    it('should update a activity journal for a user', async () => {
        jest
            .spyOn(db.ActivityJournal, 'findOne')
            .mockResolvedValueOnce(activityJournal);
        jest
            .spyOn(db.ActivityJournal, 'update')
            .mockResolvedValueOnce([1, [updatedActivityJournal]]);

        jest
            .spyOn(db.ActivityJournal, 'findOne')
            .mockResolvedValueOnce(updatedActivityJournal);

        const res = await request(app)
            .put(`/api/journals/activity/${activityJournal.id}`)
            .send(updatedActivityJournal);

        expect(db.ActivityJournal.findOne).toBeCalledTimes(2);
        expect(db.ActivityJournal.update).toBeCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toEqual(updatedActivityJournal);
    });

    it('should delete a activity journal for a user', async () => {
        jest
            .spyOn(db.ActivityJournal, 'findOne')
            .mockResolvedValueOnce(activityJournal);
        jest
            .spyOn(db.ActivityJournal, 'destroy')
            .mockResolvedValueOnce([1, [activityJournal]]);

        const res = await request(app).delete(
            `/api/journals/activity/${activityJournal.id}`
        );

        expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.message).toBe('Activity journal entry deleted successfully');
    });

    it('should handle activity journal not found error', async () => {
        jest.spyOn(db.ActivityJournal, 'findOne').mockResolvedValueOnce(null);

        const res = await request(app).get(
            `/api/journals/activity/${activityJournal.id}`
        );

        expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('NOT_FOUND');
        expect(res.body.message).toBe('Activity Journal not found');
    });

    it('should handle activity journal not found error when updating', async () => {
        jest.spyOn(db.ActivityJournal, 'findOne').mockResolvedValueOnce(null);

        const res = await request(app)
            .put(`/api/journals/activity/${activityJournal.id}`)
            .send(updatedActivityJournal);

        expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('NOT_FOUND');
        expect(res.body.message).toBe('Activity Journal not found');
    });

    it('should handle activity journal not found error when deleting', async () => {
        jest.spyOn(db.ActivityJournal, 'findOne').mockResolvedValueOnce(null);

        const res = await request(app).delete(
            `/api/journals/activity/${activityJournal.id}`
        );

        expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('NOT_FOUND');
        expect(res.body.message).toBe('Activity journal entry not found');
    });

    it('should handle error when getting activity journals', async () => {
        jest.spyOn(db.ActivityJournal, 'findAll').mockRejectedValueOnce('error');

        const res = await request(app).get(`/api/journals/activity/user/${user.uid}`);

        expect(db.User.findOne).toBeCalledTimes(1);
        expect(db.ActivityJournal.findAll).toBeCalledTimes(1);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
        expect(res.body.message).toBe('Error fetching activity journals: error');
    });

    it('should handle error when getting activity journal', async () => {
        jest.spyOn(db.ActivityJournal, 'findOne').mockRejectedValueOnce('error');

        const res = await request(app).get(
            `/api/journals/activity/${activityJournal.id}`
        );

        expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
        expect(res.body.message).toBe('Error fetching activity journal: error');
    });

    it('should handle error when creating activity journal', async () => {
        jest.spyOn(db.ActivityJournal, 'create').mockRejectedValueOnce('error');

        const res = await request(app)
            .post(`/api/journals/activity/user/${user.uid}`)
            .send(activityJournal);

        expect(db.User.findOne).toBeCalledTimes(1);
        expect(db.ActivityJournal.create).toBeCalledTimes(1);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
        expect(res.body.message).toBe('Error creating activity journal: error');
    });

    it('should handle error when updating activity journal', async () => {
        jest.spyOn(db.ActivityJournal, 'findOne').mockRejectedValueOnce('error');

        const res = await request(app)
            .put(`/api/journals/activity/${activityJournal.id}`)
            .send(updatedActivityJournal);

        expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
        expect(res.body.message).toBe('Error updating activity journal: error');
    });

    it('should handle error when deleting activity journal', async () => {
        jest.spyOn(db.ActivityJournal, 'findOne').mockRejectedValueOnce('error');

        const res = await request(app).delete(
            `/api/journals/activity/${activityJournal.id}`
        );

        expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
        expect(res.body.message).toBe('Error deleting activity journal: error');
    });

    it('should handle user not found error for create', async () => {
        jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);

        const res = await request(app).post(
            `/api/journals/activity/user/${user.uid}`
        );

        expect(db.User.findOne).toBeCalledTimes(1);
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('NOT_FOUND');
        expect(res.body.message).toBe('User not found');
    });

    it('should handle user not found error for getAllActivityJournals', async () => {
        jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);

        const res = await request(app).get(`/api/journals/activity/user/${user.uid}`);

        expect(db.User.findOne).toBeCalledTimes(1);
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('NOT_FOUND');
        expect(res.body.message).toBe('User not found');
    });
});
