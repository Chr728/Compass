import express from 'express';
import cors from 'cors';
import db from './models';
import Morgan from './middlewares/morgan';
import { Logger } from './middlewares/logger';
require('dotenv').config({
  path: './../.env',
});

const app = express();
app.use(express.json());

app.use(cors());
app.use(Morgan);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//Connection to postgreSQL
if(process.env.NODE_ENV !== 'test'){
  db.sequelize.sync().then(()=>{
    console.log("DB Synchronized.")
  });
}
  
app.listen(process.env.SERVER_DEV_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_DEV_PORT || 8000}`);
  });

export default app;
