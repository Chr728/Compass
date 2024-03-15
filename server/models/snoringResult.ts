'use strict';

import { Model } from 'sequelize';

export interface SnoringResultAttributes {
  id: number;
  uid: string;
  date: Date;
  filename: string;
  result: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class SnoringResult extends Model<SnoringResultAttributes> {
    id!: number;
    uid!: string;
    date!: Date;
    filename!: string;
    result!: string;
    static associate(models: any) {
      SnoringResult.belongsTo(models.User, {
        foreignKey: 'uid',
        targetKey: 'uid',
      });
    }
  }
  SnoringResult.init(
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
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      result: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SnoringResult',
      timestamps: false,
    }
  );
  return SnoringResult;
};
