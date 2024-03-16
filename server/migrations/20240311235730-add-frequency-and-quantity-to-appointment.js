'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Appointments', 'frequency', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Appointments', 'quantity', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Appointments', 'frequency');
    await queryInterface.removeColumn('Appointments', 'quantity');
  },
};
