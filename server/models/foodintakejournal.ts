"use strict";

import { IntegerDataType, Model } from "sequelize";

interface FoodIntakeAttributes {
  id: number;
  email: string;
  date: Date;
  time: number;
  foodname: string;
  mealtype: string;
  servingnumber: number;
  notes: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class FoodIntakeJournal extends Model<FoodIntakeAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    email!: string;
    date!: Date;
    time!: number;
    foodname!: string;
    mealtype!: string;
    servingnumber!: number;
    notes!: string;
    static associate(models: any) {
      // define association here
    }
  }
  FoodIntakeJournal.init(
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
      foodname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mealtype: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      servingnumber: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },

    {
      sequelize,
      modelName: "FoodIntakeJournal",
      timestamps: false,
    }
  );
  return FoodIntakeJournal;
};
