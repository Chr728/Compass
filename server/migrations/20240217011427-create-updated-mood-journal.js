'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('MoodJournals', 'time', 
    { type: Sequelize.TIME,
      allowNull: true,
    defaultValue:"00:00:00" });

    await queryInterface.bulkUpdate( "MoodJournals", {time: "00:00:00"},   Sequelize.literal("time is NULL"))
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MoodJournals');
     /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};