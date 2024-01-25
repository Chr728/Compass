"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable("NotificationPreferences");
    await queryInterface.createTable("NotificationPreferences", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      permissionGranted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      activityReminders: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      appointmentReminders: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      medicationReminders: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      foodIntakeReminders: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      insulinDosageReminders: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      glucoseMeasurementReminders: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("NotificationPreferences");
  },
};
