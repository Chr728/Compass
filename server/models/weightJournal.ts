"use strict";

import { IntegerDataType, Model } from "sequelize";

interface WeightJournalAttributes {
  id: number;
  email: string;
  date: Date;
  time: Date;
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
    time!: Date;
    weight!: number;
    unit!: string;
    notes!: string;
    static associate(models: any) {
      WeightJournal.belongsTo(models.User,{
        foreignKey: "email",
        targetKey: 'email',}
      )
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
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
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
        type: DataTypes.TEXT,
        allowNull: true,
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
