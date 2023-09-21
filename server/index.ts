import express from "express";
import cors from "cors";
import db from "./models";
require("dotenv").config({
  path: './../.env'
});

const app = express();
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Connection to postgreSQL
db.sequelize.sync().then(() => {
  app.listen(process.env.SERVER_DEV_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_DEV_PORT || 8000}`);
  });
});
