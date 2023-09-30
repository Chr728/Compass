"use strict";

import { IntegerDataType, Model } from "sequelize";

interface ActivityJournalAttributes {
  id: number;
  uid: string;
  date: Date;
  time: Date;
  activity: string;
  duration: number;
  notes: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class ActivityJournal extends Model<ActivityJournalAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    uid!: string;
    date!: Date;
    time!: number;
    activity!: string;
    duration!: number;
    notes!: string;
    static associate(models: any) {
      // define association here
      ActivityJournal.belongsTo(models.User,{
        foreignKey: "uid",
        targetKey: 'uid',}
      )
    }
  }
  ActivityJournal.init(
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
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      activity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },

    {
      sequelize,
      modelName: "ActivityJournal",
      timestamps: false,
    }
  );
  return ActivityJournal;
};
