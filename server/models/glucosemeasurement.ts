"use strict";

import { IntegerDataType, Model } from "sequelize";

interface GlucoseMeasurementAttributes {
  id: number;
  email: string;
  date: Date;
  mealtime: string;
  bloodglucose: number;
  unit: string;
  notes: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class GlucoseMeasurement extends Model<GlucoseMeasurementAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    email!: string;
    date!: Date;
    mealtime!: string;
    bloodglucose!: number;
    unit!: string;
    notes!: string;
    static associate(models: any) {
      // define association here
    }
  }
  GlucoseMeasurement.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      mealtime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bloodglucose: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      sequelize,
      modelName: "GlucoseMeasurement",
      timestamps: false,
    }
  );
  return GlucoseMeasurement;
};
