"use strict";

import { IntegerDataType, Model } from "sequelize";

interface FoodIntakeAttributes {
  id: number;
  uid: string;
  date: Date;
  time: Date;
  foodName: string;
  mealType: string;
  servingNumber: number;
  calorie: number;
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
    uid!: string;
    date!: Date;
    time!: Date;
    foodName!: string;
    mealType!: string;
    servingNumber!: number;
    calorie!: number;
    notes!: string;
    static associate(models: any) {
      // define association here
      FoodIntakeJournal.belongsTo(models.User,{
        foreignKey: "uid",
        targetKey: 'uid',}
      )
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
      foodName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mealType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      servingNumber: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      calorie: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
