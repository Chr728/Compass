"use strict";

import { IntegerDataType, Model } from "sequelize";

interface GlucoseMeasurementAttributes {
  id: number;
  email: string;
  date: Date;
  mealTime: string;
  bloodGlucose: number;
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
    bloodGlucose!: number;
    unit!: string;
    notes!: string;
    static associate(models: any) {
        GlucoseMeasurement.belongsTo(models.User,{
        foreignKey: "email",
        targetKey: 'email',}
      )
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
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      mealTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bloodGlucose: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
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
