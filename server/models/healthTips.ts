"use strict";

import { IntegerDataType, Model } from "sequelize";

interface HealthTipsAttributes {
  id: number;
  uid: string;
  angertips:string;
  anxietytips:string;
  attentiontips:string;
  depressiontips:string;
  overwhelmedtips:string;
  sleeptips:string;
  tiredtips:string;
  date: Date;
  time: Date;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class HealthTips extends Model<HealthTipsAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    uid!: string;
    angertips!:string;
    anxietytips!:string;
    attentiontips!:string;
    depressiontips!:string;
    overwhelmedtips!:string;
    sleeptips!:string;
    tiredtips!:string;
    date!: Date;
    time!: Date;
    static associate(models: any) {
        HealthTips.belongsTo(models.User,{
        foreignKey: "uid",
        targetKey: 'uid',}
      )
      // define association here
    }
  }
  HealthTips.init(
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
      angertips: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      anxietytips: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      attentiontips: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      depressiontips: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      overwhelmedtips: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sleeptips: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      tiredtips: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
    },

    {
      sequelize,
      modelName: "HealthTips",
      timestamps: false,
    }
  );
  return HealthTips;
};
