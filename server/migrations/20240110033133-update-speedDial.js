'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('SpeedDials');
    await queryInterface.createTable('SpeedDials', {
      id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      uid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contactName: {
        type: Sequelize.STRING,
        allowNull: false,
      }, 
      contactNumber:  {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SpeedDials');
  }
};
