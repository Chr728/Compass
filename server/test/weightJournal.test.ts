import request from 'supertest';
import app from './../index';
import db from './../models/index';

let server: any;
const port = process.env.SERVER_DEV_PORT;

const user = {
  id: 1,
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
  uid: 1,
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

beforeAll(() => {
  startServer(); // Start the server before running tests
});

afterAll(() => {
  stopServer(); // Stop the server after all tests are done
});

describe('Weight Journal Controller Tests', () => {
  jest.spyOn(db.User, 'findOne').mockResolvedValue(user);

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

  //write a test for get journal
  it('should get a weight journal for a user', async () => {
    jest
      .spyOn(db.WeightJournal, 'findOne')
      .mockResolvedValueOnce(weightJournal);

    const res = await request(app).get(
      `/api/journals/weight/${user.uid}/${weightJournal.id}`
    );

    expect(db.User.findOne).toBeCalledTimes(2);
    expect(db.WeightJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(weightJournal);
  });

  //test for create journal
  it('should create a weight journal for a user', async () => {
    jest.spyOn(db.WeightJournal, 'create').mockResolvedValueOnce(weightJournal);

    const res = await request(app)
      .post(`/api/journals/weight/${user.uid}`)
      .send(weightJournal);

    expect(db.User.findOne).toBeCalledTimes(3);
    expect(db.WeightJournal.create).toBeCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(weightJournal);
  });
});
