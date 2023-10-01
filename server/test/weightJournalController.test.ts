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

const weightJournal = {
  id: 1,
  uid: 'testuid',
  date: '2023-09-30',
  time: '12:00:00',
  weight: 70,
  height: 175,
  unit: 'kg',
  notes: 'Sample weight entry',
};

const updatedWeightJournal = {
  date: '2023-09-30',
  time: '12:00:00',
  weight: 80,
  height: 200,
  unit: 'kg',
  notes: 'Updated weight entry',
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

describe('Weight Journal Controller Tests', () => {
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

  it('should get weight journals for a user', async () => {
    jest
      .spyOn(db.WeightJournal, 'findAll')
      .mockResolvedValueOnce([weightJournal]);

    const res = await request(app).get(`/api/journals/weight/${user.uid}`);

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.WeightJournal.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual([weightJournal]);
  });

  it('should get a weight journal for a user', async () => {
    jest
      .spyOn(db.WeightJournal, 'findOne')
      .mockResolvedValueOnce(weightJournal);

    const res = await request(app).get(
      `/api/journals/weight/${user.uid}/${weightJournal.id}`
    );

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.WeightJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(weightJournal);
  });

  it('should create a weight journal for a user', async () => {
    jest.spyOn(db.WeightJournal, 'create').mockResolvedValueOnce(weightJournal);

    const res = await request(app)
      .post(`/api/journals/weight/${user.uid}`)
      .send(weightJournal);

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.WeightJournal.create).toBeCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(weightJournal);
  });

  it('should update a weight journal for a user', async () => {
    jest
      .spyOn(db.WeightJournal, 'findOne')
      .mockResolvedValueOnce(weightJournal);
    jest
      .spyOn(db.WeightJournal, 'update')
      .mockResolvedValueOnce([1, [updatedWeightJournal]]);

    jest
      .spyOn(db.WeightJournal, 'findOne')
      .mockResolvedValueOnce(updatedWeightJournal);

    const res = await request(app)
      .put(`/api/journals/weight/${user.uid}/${weightJournal.id}`)
      .send(updatedWeightJournal);

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.WeightJournal.findOne).toBeCalledTimes(2);
    expect(db.WeightJournal.update).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(updatedWeightJournal);
  });
});
