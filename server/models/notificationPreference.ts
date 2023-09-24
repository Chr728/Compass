"use strict";

import { IntegerDataType, Model } from "sequelize";

interface NotificationPreferenceAttributes {
  id: number;
  email: string;
  activityreminders: boolean;
  medicationreminders: boolean;
  appointmentreminders: boolean;
  foodintakereminders: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class NotificationPreference extends Model<NotificationPreferenceAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    email!: string;
    activityreminders!: boolean;
    medicationreminders!: boolean;
    appointmentreminders!: boolean;
    foodintakereminders!: boolean;
    static associate(models: any) {
      // define association here
      NotificationPreference.belongsTo(models.User, {
        foreignKey: "email",
        targetKey: "email",
      });
    }
  }
  NotificationPreference.init(
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
      activityreminders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      appointmentreminders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      medicationreminders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      foodintakereminders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },

    {
      sequelize,
      modelName: "NotificationPreference",
      timestamps: false,
    }
  );
  return NotificationPreference;
};
