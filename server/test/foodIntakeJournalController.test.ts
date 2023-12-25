import request from 'supertest';
import app from '../index';
import db from '../models/index';
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

const port = process.env.PORT;

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
  servingNumber: 'servingNumber',
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

describe('Testing the create food intake journal controller', () => {
  it('test to create appointment', async () => {
    mockFindOne(db.User, user);
    mockCreate(db.FoodIntakeJournal, createFoodIntakeJournal);

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
    mockFindOne(db.User, null);
    mockCreate(db.FoodIntakeJournal, createFoodIntakeJournal);

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
    mockFindOne(db.User, user);
    mockRejectedValueOnce(
      'create',
      db.FoodIntakeJournal,
      new Error('query error')
    );

    const res = await request(app)
      .post('/api/journals/foodIntake/user/uid')
      .send(createFoodIntakeJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.FoodIntakeJournal.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

  it('test the error if the data received is invalid', async () => {
    mockFindOne(db.User, user);
    mockRejectedValueOnce('create', db.FoodIntakeJournal, null);

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
    mockFindOne(db.User, user);
    mockFindAll(db.FoodIntakeJournal, foodIntakeJournals);

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
    mockFindOne(db.User, null);
    mockFindAll(db.FoodIntakeJournal, foodIntakeJournals);

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
    mockFindOne(db.User, user);
    mockRejectedValueOnce(
      'findAll',
      db.FoodIntakeJournal,
      new Error('query error')
    );

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
    mockFindOne(db.FoodIntakeJournal, foodIntakeJournals[0]);

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
    mockFindOne(db.FoodIntakeJournal, null);

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
    mockRejectedValueOnce(
      'findOne',
      db.FoodIntakeJournal,
      new Error('query error')
    );

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
    mockFindOne(db.FoodIntakeJournal, foodIntakeJournals[0]);
    mockUpdate(db.FoodIntakeJournal, updatedFoodIntakeJournal);
    mockFindOne(db.FoodIntakeJournal, updatedFoodIntakeJournal);

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
    mockFindOne(db.FoodIntakeJournal, null);
    mockUpdate(db.FoodIntakeJournal, [1]);

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
    mockFindOne(db.FoodIntakeJournal, null);
    mockUpdate(db.FoodIntakeJournal, [1]);

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
    mockFindOne(db.FoodIntakeJournal, foodIntakeJournals[0]);
    mockRejectedValueOnce(
      'update',
      db.FoodIntakeJournal,
      new Error('query error')
    );

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
    mockFindOne(db.FoodIntakeJournal, foodIntakeJournals[0]);
    mockRejectedValueOnce(
      'update',
      db.FoodIntakeJournal,
      new Error('query error')
    );

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
    mockFindOne(db.FoodIntakeJournal, foodIntakeJournals[0]);
    mockDestroy(db.FoodIntakeJournal, foodIntakeJournals[0]);

    const res = await request(app)
      .delete(`/api/journals/foodIntake/${foodIntakeJournals[0].id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.FoodIntakeJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.message).toBe('Food journal entry deleted successfully');
  });

  it('should return an error if the journal id is not found', async () => {
    mockFindOne(db.FoodIntakeJournal, null);
    mockDestroy(db.FoodIntakeJournal, [0]);

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
    mockFindOne(db.FoodIntakeJournal, foodIntakeJournals[0]);
    mockRejectedValueOnce(
      'destroy',
      db.FoodIntakeJournal,
      new Error('query error')
    );

    const res = await request(app)
      .delete('/api/journals/foodIntake/1')
      .set({ Authorization: 'Bearer token' });

    expect(db.FoodIntakeJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.destroy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
