import { v4 as uuid } from "uuid";

const users = [
  {
    id: uuid(),
    email: "example_user@example.com",
    password: "123456",
    name: "Example User",
  },
  {
    id: uuid(),
    email: "one_video_every_day@example.com",
    password: "123456",
    name: "One video every day",
  },
];

export const userIds = [users[0].id, users[1].id];

export default users;
