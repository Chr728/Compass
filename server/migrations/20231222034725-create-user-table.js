'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
       await queryInterface.createTable('Users', {
         id: {
           type: Sequelize.INTEGER,
           autoIncrement: true,
           primaryKey: true,
         },
         uid: {
           type: Sequelize.STRING,
           allowNull: false,
           unique: true,
         },
         email: {
           type: Sequelize.STRING,
           allowNull: false,
           unique: true,
         },
         firstName: {
           type: Sequelize.STRING,
           allowNull: false,
         },
         lastName: {
           type: Sequelize.STRING,
           allowNull: false,
         },
         phoneNumber: {
           type: Sequelize.STRING,
           allowNull: false,
         },
         birthDate: {
           type: Sequelize.DATE,
           allowNull: false,
         },
         sex: {
           type: Sequelize.STRING,
           allowNull: false,
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
  }
};
