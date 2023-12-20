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

const foodIntakeJournals = [
  {
    id: 1,
    uid: 'foodIntakeUid',
    date: '2023-10-19',
    time: '13:00:00',
    foodName: 'steak',
    mealType: 'mealType1',
    servingNumber: 1,
    notes: 'notes1',
  },
  {
    id: 2,
    uid: 'user2uid',
    date: '2023-10-12',
    time: '10:00:00',
    foodName: 'Apple',
    mealType: 'mealType2',
    servingNumber: 2,
    notes: 'notes2',
  },
];

const createFoodIntakeJournal = {
  id: 1,
  uid: 'foodIntakeUid',
  date: '2023-10-19',
  time: '13:00:00',
  foodName: 'steak',
  mealType: 'mealType1',
  servingNumber: 1,
  notes: 'notes1',
};

const invalidFoodIntakeJournal = {
  id: 1,
  uid: 'foodIntakeUid',
  date: '2023-10-19',
  time: '13:00:00',
  foodName: 'steak',
  mealType: 'mealType1',
  servingNumber: "servingNumber",
  notes: 'notes1',
};

const updatedFoodIntakeJournal = {
  id: 1,
  uid: 'foodIntakeUid',
  date: '2023-10-19',
  time: '13:00:00',
  foodName: 'shrimp',
  mealType: 'mealType1',
  servingNumber: 1,
  notes: 'notes1',
};

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
    .mockResolvedValue(mockedDecodedToken);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Testing the create food intake journal controller', () => {
  it('test to create appointment', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.FoodIntakeJournal, 'create')
      .mockResolvedValueOnce(createFoodIntakeJournal);
    const res = await request(app)
      .post('/api/journals/foodIntake/user/uid')
      .send(createFoodIntakeJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(createFoodIntakeJournal);
  });

  it('test the error if the user uid passed is invalid', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    jest
      .spyOn(db.FoodIntakeJournal, 'create')
      .mockResolvedValueOnce(createFoodIntakeJournal);
    const res = await request(app)
      .post('/api/journals/foodIntake/user/uid')
      .send(createFoodIntakeJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('User not found, invalid user uid.');
  });

  it('test the error if request is not made properly', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.FoodIntakeJournal, 'create')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .post('/api/journals/foodIntake/user/uid')
      .send(createFoodIntakeJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.FoodIntakeJournal.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

  it('test the error if the data received is invalid', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.FoodIntakeJournal, 'create')
      .mockRejectedValue(null);
    const res = await request(app)
      .post('/api/journals/foodIntake/user/uid')
      .send(invalidFoodIntakeJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.FoodIntakeJournal.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the get all food intake journals controller', () => {
  it('test to create appointment', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.FoodIntakeJournal, 'findAll')
      .mockResolvedValueOnce(foodIntakeJournals);
    const res = await request(app)
      .get('/api/journals/foodIntake/user/uid')
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(foodIntakeJournals);
  });

  it('test the error if the user uid passed is invalid', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    jest
      .spyOn(db.FoodIntakeJournal, 'findAll')
      .mockResolvedValueOnce(foodIntakeJournals);
    const res = await request(app)
      .get('/api/journals/foodIntake/user/uid')
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.findAll).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('User not found, invalid user uid.');
  });

  it('should catch the error', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.FoodIntakeJournal, 'findAll')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .get('/api/journals/foodIntake/user/uid')
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the get one food intake journals controller', () => {
  it('test to create appointment', async () => {
    jest
      .spyOn(db.FoodIntakeJournal, 'findOne')
      .mockResolvedValueOnce(foodIntakeJournals[0]);
    const res = await request(app)
      .get(`/api/journals/foodIntake/1`)
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.FoodIntakeJournal.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(foodIntakeJournals[0]);
  });

  it('test the error if the journal id passed is invalid', async () => {
    jest.spyOn(db.FoodIntakeJournal, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .get('/api/journals/foodIntake/1')
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.FoodIntakeJournal.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Food intake journal not found, invalid journal id.'
    );
  });

  it('should catch the error', async () => {
    jest
      .spyOn(db.FoodIntakeJournal, 'findOne')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .get('/api/journals/foodIntake/1')
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.FoodIntakeJournal.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the update food intake journal controller', () => {
  it('should update a food intake journal for a user', async () => {
    jest
      .spyOn(db.FoodIntakeJournal, 'findOne')
      .mockResolvedValueOnce(foodIntakeJournals[0]);
    jest
      .spyOn(db.FoodIntakeJournal, 'update')
      .mockResolvedValueOnce([1, [updatedFoodIntakeJournal]]);

    jest
      .spyOn(db.FoodIntakeJournal, 'findOne')
      .mockResolvedValueOnce(updatedFoodIntakeJournal);

    const res = await request(app)
      .put(`/api/journals/foodIntake/${foodIntakeJournals[0].id}`)
      .send(updatedFoodIntakeJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.FoodIntakeJournal.findOne).toBeCalledTimes(2);
    expect(db.FoodIntakeJournal.update).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(updatedFoodIntakeJournal);
  });

  it('should return an error if the user is not found ', async () => {
    jest.spyOn(db.FoodIntakeJournal, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.FoodIntakeJournal, 'update').mockResolvedValueOnce([1]);
    const res = await request(app)
      .put('/api/journals/foodIntake/1')
      .send(foodIntakeJournals[0])
      .set({ Authorization: 'Bearer token' });

    expect(db.FoodIntakeJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.update).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Food intake journal not found, invalid journal id.'
    );
  });

  it('should return an error if the journal id is invalid', async () => {
    jest.spyOn(db.FoodIntakeJournal, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.FoodIntakeJournal, 'update').mockResolvedValueOnce([1]);
    const res = await request(app)
      .put('/api/journals/foodIntake/1')
      .send(foodIntakeJournals[0])
      .set({ Authorization: 'Bearer token' });

    expect(db.FoodIntakeJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.update).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Food intake journal not found, invalid journal id.'
    );
  });

  it('should return an error updating the journal', async () => {
    jest
      .spyOn(db.FoodIntakeJournal, 'findOne')
      .mockResolvedValueOnce(foodIntakeJournals[0]);
    jest
      .spyOn(db.FoodIntakeJournal, 'update')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .put('/api/journals/foodIntake/1')
      .send(foodIntakeJournals[0])
      .set({ Authorization: 'Bearer token' });

    expect(db.FoodIntakeJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.update).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

  it('should return an error updating the journal if the data is invalid', async () => {
    jest
      .spyOn(db.FoodIntakeJournal, 'findOne')
      .mockResolvedValueOnce(foodIntakeJournals[0]);
    jest
      .spyOn(db.FoodIntakeJournal, 'update')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .put('/api/journals/foodIntake/1')
      .send(invalidFoodIntakeJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.FoodIntakeJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.update).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the delete food intake journal controller', () => {
  it('should delete a food intake journal for a user', async () => {
    jest
      .spyOn(db.FoodIntakeJournal, 'findOne')
      .mockResolvedValueOnce(foodIntakeJournals[0]);
    jest
      .spyOn(db.FoodIntakeJournal, 'destroy')
      .mockResolvedValueOnce([1, [foodIntakeJournals[0]]]);

    const res = await request(app)
      .delete(`/api/journals/foodIntake/${foodIntakeJournals[0].id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.FoodIntakeJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.message).toBe('Food journal entry deleted successfully');
  });

  it('should return an error if the journal id is not found', async () => {
    jest.spyOn(db.FoodIntakeJournal, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.FoodIntakeJournal, 'destroy').mockResolvedValueOnce([0]);
    const res = await request(app)
      .delete('/api/journals/foodIntake/1')
      .set({ Authorization: 'Bearer token' });

    expect(db.FoodIntakeJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.destroy).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Food journal entry not found');
  });

  it('should return an error deleting the journal', async () => {
    jest
      .spyOn(db.FoodIntakeJournal, 'findOne')
      .mockResolvedValueOnce(foodIntakeJournals[0]);
    jest
      .spyOn(db.FoodIntakeJournal, 'destroy')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .delete('/api/journals/foodIntake/1')
      .set({ Authorization: 'Bearer token' });

    expect(db.FoodIntakeJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.destroy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
