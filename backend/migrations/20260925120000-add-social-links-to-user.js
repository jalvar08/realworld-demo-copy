"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "website", {
      type: Sequelize.TEXT,
      defaultValue: null,
    });
    await queryInterface.addColumn("Users", "github", {
      type: Sequelize.TEXT,
      defaultValue: null,
    });
    await queryInterface.addColumn("Users", "twitter", {
      type: Sequelize.TEXT,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("Users", "website");
    await queryInterface.removeColumn("Users", "github");
    await queryInterface.removeColumn("Users", "twitter");
  },
};
