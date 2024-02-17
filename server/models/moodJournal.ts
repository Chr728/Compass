"use strict";

import { IntegerDataType, Model } from "sequelize";

interface MoodJournalAttributes {
  id: number;
  uid: string;
  howAreYou: string;
  stressSignals: string;
  date: Date;
  notes: string;
  time: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class MoodJournal extends Model<MoodJournalAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    uid!: string;
    howAreYou!: string;
    stressSignals!: string;
    date!: Date;
    notes!: string;
    time!: Date;
    static associate(models: any) {
      MoodJournal.belongsTo(models.User,{
        foreignKey: "uid",
        targetKey: 'uid',}
      )
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
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      howAreYou: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stressSignals: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue:"00:00:00",
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
