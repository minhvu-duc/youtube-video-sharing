const { v4: uuid } = require("uuid");
const { userIds } = require("./user");

const videos = [
  {
    id: uuid(),
    userId: userIds[0],
    url: "https://www.youtube.com/watch?v=-pHfPJGatgE",
    title: "Example Video 01",
    describe: "Example Description 01",
  },
  {
    id: uuid(),
    userId: userIds[0],
    url: "https://www.youtube.com/watch?v=wC8nR_rhePY",
    title: "Example Video 02",
    describe: "Example Description 02",
  },
  {
    id: uuid(),
    userId: userIds[1],
    url: "https://www.youtube.com/watch?v=eYAd4uDotF0",
    title: "Example Video 03",
    describe: "Example Description 03",
  },
  {
    id: uuid(),
    userId: userIds[1],
    url: "https://www.youtube.com/watch?v=5GUaMOpfmr8",
    title: "Example Video 04",
    describe: "Example Description 04",
  },
];

export default videos;
