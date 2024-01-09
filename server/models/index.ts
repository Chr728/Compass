"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db: any = {};

let sequelize: any;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
      logging: false,
      dialectOptions: {
          ssl: {
              require: true,
              rejectUnauthorized: false,
          }
      }
  });
} else {
  config.logging= false;
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const fileExtension = env === 'production' ? '.js' : '.ts';

fs
    .readdirSync(__dirname)
    .filter((file: string) => {
      return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === fileExtension &&
          file.indexOf(`.test${fileExtension}`) === -1
      );
    })
    .forEach((file:  any) => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
