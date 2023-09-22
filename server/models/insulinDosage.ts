"use strict";

import { IntegerDataType, Model } from "sequelize";

interface InsulinDosageAttributes {
  id: number;
  email: string;
  date: Date;
  time: Date;
  typeOfInsulin: string;
  unit: number;
  bodySite: string;
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
    time!: Date;
    typeOfInsulin!: string;
    unit!: number;
    bodySite!: string;
    notes!: string;
    static associate(models: any) {
      InsulinDosage.belongsTo(models.User,{
        foreignKey: "email",
        targetKey: 'email',}
      )
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
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      typeOfInsulin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bodySite: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
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
