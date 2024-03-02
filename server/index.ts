import cors from 'cors';
import express from 'express';
import cron from 'node-cron';
import decodeToken from './middlewares/decodeToken';
import { handleError } from './middlewares/errorMiddleware';
import { Logger } from './middlewares/logger';
import Morgan from './middlewares/morgan';
import db from './models';
import activityJournalRoutes from './routes/activityJournalRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import diabeticGlucoseJournalRoutes from './routes/diabeticGlucoseJournalRoutes';
import diabeticInsulinJournalRoutes from './routes/diabeticInsulinJournalRoutes';
import foodIntakeJournalRoutes from './routes/foodIntakeJournalRoutes';
import medicationRoutes from './routes/medicationRoutes';
import moodJournalRoutes from './routes/moodJournalRoutes';
import notificationRoutes from './routes/notificationPreferenceRoutes';
import speedDialRoutes from './routes/speedDialRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import userRoutes from './routes/userRoutes';
import weightJournalRoutes from './routes/weightJournalRoutes';
import { sendUserReminders } from './tasks/reminderTask';
import o2SaturationJournalRoutes from './routes/o2SaturationJournalRoutes';
import bloodPressureRoutes from "./routes/bloodPressureRoutes";

require('dotenv').config({
  path: './../.env',
});

const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDevelopment = process.env.NODE_ENV === 'development';

app.use(cors());
app.use(express.json());
app.use(Morgan);
app.use('/medicationImages', express.static('./medicationImages'));
app.use(decodeToken);
app.use('/api/journals/weight', weightJournalRoutes);
app.use('/api/journals/mood', moodJournalRoutes);
app.use('/api/journals/diabetic/glucose', diabeticGlucoseJournalRoutes);
app.use('/api/journals/diabetic/insulin', diabeticInsulinJournalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/journals/activity', activityJournalRoutes);
app.use('/api/speed-dials', speedDialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/journals/foodIntake', foodIntakeJournalRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/medication', medicationRoutes);
app.use('/api/journals/o2Saturation', o2SaturationJournalRoutes);
app.use('/api/journals/bloodPressure', bloodPressureRoutes);
app.use(handleError);

// Schedule the task within the main process
cron.schedule('*/10 * * * *', () => {
  console.log('Running the scheduled task...');
  sendUserReminders();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//Connection to postgreSQL
if (isDevelopment) {
  db.sequelize.sync({ alter: true }).then(() => {
    Logger.info('Database Synchronized');
  });
}

if (!isTest) {
  app.listen(process.env.PORT, () => {
    Logger.info(`Server listening on port ${process.env.PORT || 8000}`);
  });
}

export default app;
