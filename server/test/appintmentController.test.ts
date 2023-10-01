import request from 'supertest';
import app from './../index';
import db from './../models/index';

let server: any;
const port = process.env.SERVER_DEV_PORT;

const appointment = {
    id: 1,
    uid: 'appointUid',
    appointmentWith: 'John Doe',
    date: '2023-09-23T10:30:00.000Z',
    time: '00:00:00',
    notes: 'Call the doctor back 2 days later',
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

  describe('should test the getAppointment Controller', () => {
    it('should get one specific appointment', async () => {
      jest.spyOn(db.Appointment, 'findOne').mockResolvedValueOnce(appointment);
      const res = await request(app).get('/api/appointments/single/1')
      expect(db.Appointment.findOne).toBeCalledTimes(1);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('SUCCESS');
      expect(res.body.data).toStrictEqual(appointment);
    });

    it('should give error when the appointment id sent is wrong', async () => {
        const nonExistentAppointmentId = 0;
        jest.spyOn(db.Appointment, 'findOne').mockResolvedValueOnce(null);
        const res = await request(app).get(`/api/appointments/single/${nonExistentAppointmentId}`)
        expect(db.Appointment.findOne).toBeCalledTimes(2);
        expect(res.status).toBe(404);
        expect(res.body.status).toBe('ERROR');
      });

      it('should catch error ', async () => {
        const nonExistentAppointmentId = 0;
        jest.spyOn(db.Appointment, 'findOne').mockRejectedValue(new Error('query error'));
        const res = await request(app).get('/api/appointments/single/1')
        expect(db.Appointment.findOne).toBeCalledTimes(3);
        expect(res.status).toBe(400);
        expect(res.body.status).toBe('ERROR');
      });



  });

