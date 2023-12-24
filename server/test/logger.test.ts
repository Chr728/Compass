import { Logger, RequestLogger } from '../middlewares/logger';

jest.mock('winston', () => ({
  createLogger: jest.fn(() => ({
    log: jest.fn(),
  })),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    json: jest.fn(),
    errors: jest.fn(),
    printf: jest.fn((formatter) => formatter({ message: 'Test log' })), // Simulate log output
  },
  transports: {
    Console: jest.fn(),
    DailyRotateFile: jest.fn(),
  },
}));

describe('Logging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log HTTP requests', () => {
    const sampleRequest: any = {
      method: 'GET',
      status: 200,
      url: '/test',
      response_time: 50,
    };

    RequestLogger.log(sampleRequest);

    expect(RequestLogger.log).toHaveBeenCalledWith(sampleRequest);
  });

  it('should log general server information', () => {
    const sampleLog: any = { message: 'Some server log message' };

    Logger.log(sampleLog);

    expect(Logger.log).toHaveBeenCalledWith(sampleLog);
  });
});
