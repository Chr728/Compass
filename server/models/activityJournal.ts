"use strict";

import { IntegerDataType, Model } from "sequelize";

interface ActivityJournalAttributes {
  id: number;
  email: string;
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
    email!: string;
    date!: Date;
    time!: number;
    activity!: string;
    duration!: number;
    notes!: string;
    static associate(models: any) {
      // define association here
      ActivityJournal.belongsTo(models.User,{
        foreignKey: "email",
        targetKey: 'email',}
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
      email: {
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
