module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Video", "title", {
      allowNull: false,
      type: Sequelize.STRING(300),
      defaultValue: "Unknown",
    });

    await queryInterface.addColumn("Video", "description", {
      allowNull: false,
      type: Sequelize.STRING(2000),
      defaultValue: "Unknown",
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Video", "title");
    await queryInterface.removeColumn("Video", "description");
  },
};
