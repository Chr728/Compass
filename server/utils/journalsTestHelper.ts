import admin from 'firebase-admin';

export const startServer = (app: any, port: any) => {
  return app.listen(port);
};

export const stopServer = (server: any) => {
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

export const mockFindAll = (model: any, data: any[]) => {
  jest.spyOn(model, 'findAll').mockResolvedValue(data);
};

export const mockCreate = (model: any, createdData: any) => {
  jest.spyOn(model, 'create').mockResolvedValue(createdData);
};

export const mockUpdate = (model: any, updatedData: any) => {
  jest.spyOn(model, 'update').mockResolvedValue([1, [updatedData]]);
};

export const mockDestroy = (model: any, destroyedData: any) => {
  jest.spyOn(model, 'destroy').mockResolvedValue([1, [destroyedData]]);
};

export const mockRejectedValueOnce = (method: any, model: any, data: any) => {
  jest.spyOn(model, method).mockRejectedValueOnce(data);
};
