"use strict";

import { IntegerDataType, Model } from "sequelize";

interface NotificationPreferenceAttributes {
  id: number;
  uid: string;
  permissionGranted: boolean;
  activityReminders: boolean;
  medicationReminders: boolean;
  appointmentReminders: boolean;
  foodIntakeReminders: boolean;
  insulinDosageReminders: boolean;
  glucoseMeasurementReminders: boolean;
  moodReminders: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class NotificationPreference extends Model<NotificationPreferenceAttributes> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id!: number;
    uid!: string;
    permissionGranted!: boolean;
    activityReminders!: boolean;
    medicationReminders!: boolean;
    appointmentReminders!: boolean;
    foodIntakeReminders!: boolean;
    insulinDosageReminders!: boolean;
    glucoseMeasurementReminders!: boolean;
    moodReminders!: boolean;
    static associate(models: any) {
      // define association here
      NotificationPreference.belongsTo(models.User, {
        foreignKey: "uid",
        targetKey: "uid",
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
      uid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permissionGranted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      activityReminders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      appointmentReminders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      medicationReminders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      foodIntakeReminders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      insulinDosageReminders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      glucoseMeasurementReminders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      moodReminders: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
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
