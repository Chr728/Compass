import express from 'express';
import cors from 'cors';
import db from './models';
import userRoutes from './routes/userRoutes';
import activityJournalRoutes from './routes/activityJournalRoutes';
import speedDialRoutes from './routes/speedDialRoutes';
import weightJournalRoutes from './routes/weightJournalRoutes';
import moodJournalRoutes from './routes/moodJournalRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import notificationRoutes from './routes/notificationPreferenceRoutes';
import foodIntakeJournalRoutes from './routes/foodIntakeJournalRoutes';
import reminderRoutes from './routes/remindersRoutes';
import diabeticGlucoseJournalRoutes from './routes/diabeticGlucoseJournalRoutes';
import diabeticInsulinJournalRoutes from './routes/diabeticInsulinJournalRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import medicationRoutes from './routes/medicationRoutes';
import Morgan from './middlewares/morgan';
import { Logger } from './middlewares/logger';
import decodeToken from './middlewares/decodeToken';
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
app.use('/api/reminders', reminderRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/medication', medicationRoutes);

if (isDevelopment) {
  db.sequelize.sync({alter: true}).then(() => {
    Logger.info('Database Synchronized');
  });
}

if (!isTest) {
  app.listen(process.env.PORT, () => {
    Logger.info(
        `Server listening on port ${process.env.PORT || 8000}`
    );
  });
}

export default app;
