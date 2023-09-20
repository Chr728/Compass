"use strict";

import { IntegerDataType, Model } from "sequelize";

interface WeightJournalAttributes {
  id: number;
  email: string;
  date: Date;
  time: number;
  weight: number;
  unit: string;
  notes: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class WeightJournal extends Model<WeightJournalAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    email!: string;
    date!: Date;
    time!: number;
    weight!: number;
    unit!: string;
    notes!: string;
    static associate(models: any) {
      // define association here
    }
  }
  WeightJournal.init(
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
      weight: {
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
      modelName: "WeightJournal",
      timestamps: false,
    }
  );
  return WeightJournal;
};
