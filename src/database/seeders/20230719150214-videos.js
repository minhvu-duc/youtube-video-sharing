const { v4: uuid } = require("uuid");
const { userIds } = require("./20230719150211-users");

const videos = [
  {
    id: uuid(),
    userId: userIds[0],
    url: "https://www.youtube.com/watch?v=-pHfPJGatgE",
  },
  {
    id: uuid(),
    userId: userIds[0],
    url: "https://www.youtube.com/watch?v=wC8nR_rhePY",
  },
  {
    id: uuid(),
    userId: userIds[1],
    url: "https://www.youtube.com/watch?v=eYAd4uDotF0",
  },
  {
    id: uuid(),
    userId: userIds[1],
    url: "https://www.youtube.com/watch?v=5GUaMOpfmr8",
  },
];

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Video", videos);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Video", null);
  },
};
