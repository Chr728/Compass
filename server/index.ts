import express from "express";
import cors from "cors";
import db from "./models";
import userRoutes from "./routes/userRoutes";
require("dotenv").config({
  path: './../.env'
});

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Connection to postgreSQL
db.sequelize.sync().then(() => {
  app.listen(process.env.SERVER_DEV_PORT, () => {
    console.log(`Server listening on port ${process.env.SERVER_DEV_PORT || 8000}`);
  });
});
