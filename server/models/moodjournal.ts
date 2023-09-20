"use strict";

import { IntegerDataType, Model } from "sequelize";

interface MoodJournalAttributes {
  id: number;
  email: string;
  howareyou: string;
  stresssignals: string;
  date: number;
  notes: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class MoodJournal extends Model<MoodJournalAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    email!: string;
    howareyou!: string;
    stresssignals!: string;
    date!: number;
    notes!: string;
    static associate(models: any) {
      // define association here
    }
  }
  MoodJournal.init(
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
      howareyou: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stresssignals: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      sequelize,
      modelName: "MoodJournal",
      timestamps: false,
    }
  );
  return MoodJournal;
};
