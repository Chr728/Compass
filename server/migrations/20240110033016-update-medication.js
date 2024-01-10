'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.dropTable('Medications');

    await queryInterface.createTable('Medications', {
      id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      uid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      medicationName: {
        type: Sequelize.STRING,
        allowNull: false,
      }, 
      dateStarted: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      dosage: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      }, 
      frequency: {
        type: Sequelize.STRING,
        allowNull: false,
      }, 
      route: {
        type: Sequelize.STRING,
        allowNull: false,
      }, 
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      }  
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Medications');
  }
};
