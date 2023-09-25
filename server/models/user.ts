"use strict";

import { Model } from "sequelize";

export type UserAttributes = {
  id: number;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
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
    streetAddress!: string;
    city!: string;
    province!: string;
    postalCode!: string;
    phoneNumber!: string;
    birthDate!: Date;
    sex!: string;

    static associate(models: any) {
      // define association here
      User.hasMany(models.GlucoseMeasurement, {
        foreignKey: "email",
        sourceKey: "email",
      });

      User.hasMany(models.InsulinDosage, {
        foreignKey: "email",
        sourceKey: "email",
      });

      User.hasMany(models.FoodIntakeJournal, {
        foreignKey: "email",
        sourceKey: "email",
      });

      User.hasMany(models.ActivityJournal, {
        foreignKey: "email",
        sourceKey: "email",
      });

      User.hasMany(models.MoodJournal, {
        foreignKey: "email",
        sourceKey: "email",
      });

      User.hasMany(models.WeightJournal, {
        foreignKey: "email",
        sourceKey: "email",
      });

      User.hasMany(models.Appointment, {
        foreignKey: "email",
        sourceKey: "email",
      });

      User.hasMany(models.Medication, {
        foreignKey: "email",
        sourceKey: "email",
      });

      User.hasMany(models.SpeedDial, {
        foreignKey: "email",
        sourceKey: "email",
      });

      User.hasOne(models.NotificationPreference, {
        foreignKey: "email",
        sourceKey: "email",
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
      streetAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
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
