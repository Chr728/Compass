"use strict";

import { Model } from "sequelize";

export type UserAttributes = {
  id: number;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: Date;
  sex: string;

  // other attributes...
};

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    uid!: string;
    email!: string;
    firstName!: string;
    lastName!: string;
    phoneNumber!: string;
    birthDate!: Date;
    sex!: string;

    static associate(models: any) {
      // define association here
      User.hasMany(models.GlucoseMeasurement, {
        foreignKey: "uid",
        sourceKey: "uid",
      });

      User.hasMany(models.InsulinDosage, {
        foreignKey: "uid",
        sourceKey: "uid",
      });

      User.hasMany(models.FoodIntakeJournal, {
        foreignKey: "uid",
        sourceKey: "uid",
      });

      User.hasMany(models.ActivityJournal, {
        foreignKey: "uid",
        sourceKey: "uid",
      });

      User.hasMany(models.MoodJournal, {
        foreignKey: "uid",
        sourceKey: "uid",
      });

      User.hasMany(models.WeightJournal, {
        foreignKey: "uid",
        sourceKey: "uid",
      });

      User.hasMany(models.Appointment, {
        foreignKey: "uid",
        sourceKey: "uid",
      });

      User.hasMany(models.Medication, {
        foreignKey: "uid",
        sourceKey: "uid",
      });

      User.hasMany(models.SpeedDial, {
        foreignKey: "uid",
        sourceKey: "uid",
      });

      User.hasOne(models.NotificationPreference, {
        foreignKey: "uid",
        sourceKey: "uid",
      });

      User.hasOne(models.Subscription, {
        foreignKey: "uid",
        sourceKey: "uid",
      });
    
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      sex: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      timestamps: false,
    }
  );
  return User;
};
