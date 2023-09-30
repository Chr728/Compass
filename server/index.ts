import express from 'express';
import cors from 'cors';
import db from './models';
import userRoutes from './routes/userRoutes';
import weightJournalRoutes from './routes/weightJournalRoutes';
import Morgan from './middlewares/morgan';
import { Logger } from './middlewares/logger';
require('dotenv').config({
  path: './../.env',
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(Morgan);

app.use('/api/users', userRoutes);
app.use('/api/journals/weight', weightJournalRoutes);

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
