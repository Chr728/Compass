import admin from 'firebase-admin';
import app from '../index';
import db from './../models/index';

let server: any;
const port = process.env.SERVER_DEV_PORT;

export const user = {
  id: 10,
  uid: 'testuid',
  email: 'test@gmail.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '5147894561',
  birthDate: '1990-12-31T00:00:00.000Z',
  sex: 'male',
};

export const startServer = () => {
  server = app.listen(port);
};

export const stopServer = () => {
  if (server) {
    server.close();
  }
};

export const mockTokenVerification = (decodedToken: any) => {
  jest.spyOn(admin.auth(), 'verifyIdToken').mockResolvedValue(decodedToken);
};

export const mockFindOne = (model: any, data: any) => {
  jest.spyOn(model, 'findOne').mockResolvedValue(data);
};

export const mockFindAll = (model: any, data: any) => {
  jest.spyOn(model, 'findAll').mockResolvedValue(data);
};

export const mockCreate = (model: any, createdData: any) => {
  jest.spyOn(model, 'create').mockResolvedValue(createdData);
};

export const mockUpdate = (model: any, updatedData: any) => {
  if (model === db.User) {
    return jest.spyOn(model, 'update').mockResolvedValueOnce(updatedData);
  }
  jest.spyOn(model, 'update').mockResolvedValue([1, [updatedData]]);
};

export const mockDestroy = (model: any, destroyedData: any) => {
  jest.spyOn(model, 'destroy').mockResolvedValue([1, [destroyedData]]);
};

export const mockRejectedValueOnce = (method: any, model: any, data: any) => {
  jest.spyOn(model, method).mockRejectedValueOnce(data);
};
