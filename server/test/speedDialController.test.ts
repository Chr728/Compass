import request from 'supertest';
import app from './../index';
import db from './../models/index';

let server: any;
const port = process.env.SERVER_DEV_PORT;

const speedDial = {
    contactName: 'John',
    contactNumber: '5147894561',
}

const invalidSpeedDial = {
    contactName: 'John',
}

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

describe('should test the getSpeedDials Controller', () => {
    it('show get all speed dials', async () => {
        jest.spyOn(db.SpeedDial, 'findAll').mockResolvedValueOnce(speedDial);
        const res = await request(app).get('/api/speed-dials/123');
        expect(db.SpeedDial.findAll).toBeCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toStrictEqual(speedDial);
    });

    it('should return an error for a non-existent user id', async () => {
        jest
            .spyOn(db.SpeedDial, 'findAll')
            .mockRejectedValue(new Error('connection error'));
        const res = await request(app).get('/api/speed-dials/123');
        expect(db.SpeedDial.findAll).toBeCalledTimes(2);
        expect(res.status).toBe(400);

    }
    );

}
);

describe('should test the getSpeedDial Controller', () => {
    it('show get speed dial', async () => {
        jest.spyOn(db.SpeedDial, 'findOne').mockResolvedValueOnce(speedDial);
        const res = await request(app).get('/api/speed-dials/123/1');
        expect(db.SpeedDial.findOne).toBeCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toStrictEqual(speedDial);
    });

    it('should return an error for a connection error', async () => {
        jest
            .spyOn(db.SpeedDial, 'findOne')
            .mockRejectedValue(new Error('connection error'));
        const res = await request(app).get('/api/speed-dials/123/1');
        expect(db.SpeedDial.findOne).toBeCalledTimes(2);
        expect(res.status).toBe(400);
    }
    );

    it('should return an error for a non-existent speed dial', async () => {
        jest
            .spyOn(db.SpeedDial, 'findOne')
            .mockResolvedValueOnce(null);
        const res = await request(app).get('/api/speed-dials/123/1');
        expect(db.SpeedDial.findOne).toBeCalledTimes(3);
        expect(res.status).toBe(404);
    }
    );

}
);

describe('should test the createSpeedDial Controller', () => {
    it('show create speed dial', async () => {
        jest.spyOn(db.SpeedDial, 'create').mockResolvedValueOnce(speedDial);
        const res = await request(app).post('/api/speed-dials/').send(speedDial);
        expect(db.SpeedDial.create).toBeCalledTimes(1);
        expect(res.status).toBe(201);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toStrictEqual(speedDial);
    }
    );

    it('should return an error for an invalid speed dial', async () => {
        jest
            .spyOn(db.SpeedDial, 'create')
            .mockRejectedValue(new Error('connection error'));
        const res = await request(app).post('/api/speed-dials/').send(invalidSpeedDial);
        expect(db.SpeedDial.create).toBeCalledTimes(2);
        expect(res.status).toBe(400);
    }
    );
}
);

describe('should test the updateSpeedDial Controller', () => {
    const updatedSpeedDial = {
        contactName: 'Bob',
        contactNumber: '5147894561',
    }

    // Mocking findOne
    const mockFindOne = jest.spyOn(db.SpeedDial, 'findOne');

    afterEach(() => {
        jest.clearAllMocks(); // Clears the mock call count after each test
    });

    it('show update speed dial', async () => {
        const mockSpeedDialInstance = {
            update: jest.fn().mockImplementationOnce((data) => {
                Object.assign(mockSpeedDialInstance, data);
                return Promise.resolve([1]); // Sequelize usually returns the number of affected rows
            })
        };

        mockFindOne.mockResolvedValueOnce(mockSpeedDialInstance);

        const res = await request(app).put('/api/speed-dials/1/1').send(updatedSpeedDial);
        expect(mockFindOne).toBeCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('SUCCESS');
        expect(res.body.data).toStrictEqual(updatedSpeedDial);
    });


    it('should return an error for an invalid speed dial', async () => {
        mockFindOne.mockRejectedValueOnce(new Error('connection error'));
        const res = await request(app).put('/api/speed-dials/123/1').send(invalidSpeedDial);
        expect(mockFindOne).toBeCalledTimes(1);
        expect(res.status).toBe(400);
    });
});
