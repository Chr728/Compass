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
import locationRoutes from "./routes/locationRoutes";
import { sendMoodReminder } from './tasks/moodReminderTask';
import snoringResultRoutes from './routes/snoringResultRoutes';
import bloodPressureRoutes from './routes/bloodPressureRoutes';
import emergencyRoomRoutes from './routes/emergencyRoomRoutes';
import scraper from './utils/scraper';

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
app.use('/api/locations', locationRoutes);
app.use('/api/snoringAI', snoringResultRoutes);
app.use('/api/journals/bloodPressure', bloodPressureRoutes);
app.use('/api/emergencyRoomData', emergencyRoomRoutes);
app.use(handleError);

// Schedule the task within the main process
cron.schedule('*/10 * * * *', () => {
  console.log('Running the scheduled task...');
  sendUserReminders();
});


// Schedule the mood journal reminder
cron.schedule("*/30 * * * *", () => {
  sendMoodReminder();
})

// Schedule scraper task
cron.schedule('0 0 */2 * * *', () => {
  Logger.info('Running the scheduled emergency room scraper task...');
  scraper()
    .then(() => {
      Logger.info('Scraping completed. ER data file updated.');
    })
    .catch((err) => {
      Logger.error('Error scraping ER data: ', err);
    });
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
