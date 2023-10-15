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
import Morgan from './middlewares/morgan';
import { Logger } from './middlewares/logger';
import decodeToken from './middlewares/decodeToken';
require('dotenv').config({
  path: './../.env',
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(Morgan);
app.use(decodeToken);

app.use('/api/journals/weight', weightJournalRoutes);
app.use('/api/journals/mood', moodJournalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/journals/activity', activityJournalRoutes);
app.use('/api/speed-dials', speedDialRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/journals/foodIntake", foodIntakeJournalRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//Connection to postgreSQL
if (process.env.NODE_ENV !== 'test') {
  db.sequelize.sync({ alter: true }).then(() => {
    Logger.info('Database Synchronized');
  });

  app.listen(process.env.SERVER_DEV_PORT, () => {
    Logger.info(
      `Server listening on port ${process.env.SERVER_DEV_PORT || 8000}`
    );
  });
}

export default app;
