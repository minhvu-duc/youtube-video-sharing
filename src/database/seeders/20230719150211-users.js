const { v4: uuid } = require("uuid");

const users = [
  {
    id: uuid(),
    email: "example_user@example.com",
    password: "$2b$10$X7PTdfgOODL0S7AW..PTKOQeY2eYZfrmLm3bO3pAE/iNWeVGK1QXS", // example_password
    name: "Example User",
  },
  {
    id: uuid(),
    email: "one_video_every_day@example.com",
    password: "$2b$10$X7PTdfgOODL0S7AW..PTKOQeY2eYZfrmLm3bO3pAE/iNWeVGK1QXS",
    name: "One video every day",
  },
];

module.exports = {
  userIds: users.map((book) => book.id),
  async up(queryInterface) {
    await queryInterface.bulkInsert("User", users);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("User", null);
  },
};
