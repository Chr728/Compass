"use strict";

import { IntegerDataType, Model } from "sequelize";

interface FoodIntakeAttributes {
  id: number;
  email: string;
  date: Date;
  time: Date;
  foodName: string;
  mealType: string;
  servingNumber: number;
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
    time!: Date;
    foodName!: string;
    mealType!: string;
    servingNumber!: number;
    notes!: string;
    static associate(models: any) {
      // define association here
      FoodIntakeJournal.belongsTo(models.User,{
        foreignKey: "email",
        targetKey: 'email',}
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
    },

    {
      sequelize,
      modelName: "FoodIntakeJournal",
      timestamps: false,
    }
  );
  return FoodIntakeJournal;
};
