"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable("NotificationPreferences");
    await queryInterface.createTable("NotificationPreferences", {
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
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("NotificationPreferences");
  },
};
