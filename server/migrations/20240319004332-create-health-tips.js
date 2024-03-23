'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HealthTips', {
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
      angertips: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      anxietytips: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      attentiontips: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      depressiontips: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      overwhelmedtips: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sleeptips: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tiredtips: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};