"use strict";

import { IntegerDataType, Model } from "sequelize";

interface InsulinDosageAttributes {
  id: number;
  email: string;
  date: Date;
  time: number;
  typeofinsulin: string;
  unit: number;
  bodysite: string;
  notes: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class InsulinDosage extends Model<InsulinDosageAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    email!: string;
    date!: Date;
    time!: number;
    typeofinsulin!: string;
    unit!: number;
    bodysite!: string;
    notes!: string;
    static associate(models: any) {
      // define association here
    }
  }
  InsulinDosage.init(
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
      time: {
        type: "TIMESTAMP",
        allowNull: false,
      },
      typeofinsulin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bodysite: {
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
      modelName: "InsulinDosage",
      timestamps: false,
    }
  );
  return InsulinDosage;
};
