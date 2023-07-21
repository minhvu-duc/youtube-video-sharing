import { User } from "@database/user";

import {
  users, setupDatabaseBeforeAll, teardownDatabaseAfterAll, seedDatabaseBeforeEach,
} from "../__fixture__/db";

describe("User", () => {
  beforeAll(setupDatabaseBeforeAll);
  afterAll(teardownDatabaseAfterAll);

  beforeEach(async () => {
    await seedDatabaseBeforeEach();
  });

  it("gets correct total user count", async () => {
    const totalUsers = users.length;
    const totalCreatedUsers = await User.count();

    expect(totalCreatedUsers).toBe(totalUsers);
  });

  it("creates a new user with encrypted password", async () => {
    const newUser = {
      email: "new_user@example.com",
      password: "password123",
      name: "New User",
    };

    const createdUser = await User.create(newUser);

    expect(createdUser).toBeTruthy();
    expect(createdUser.password).not.toBe(newUser.password);
  });

  it("updates a user", async () => {
    const userToUpdate = users[0];
    const updatedName = "Updated User Name";

    await User.update(
      { name: updatedName },
      { where: { id: userToUpdate.id } },
    );

    const updatedUser = await User.findByPk(userToUpdate.id);

    expect(updatedUser?.name).toBe(updatedName);
    expect(updatedUser?.id).toBe(userToUpdate.id);
    expect(updatedUser?.email).toBe(userToUpdate.email);
    expect(updatedUser?.password).toBe(userToUpdate.password);
  });

  it("deletes a user", async () => {
    const userToDelete = users[0];

    await User.destroy({ where: { id: userToDelete.id } });

    const deletedUser = await User.findByPk(userToDelete.id);
    expect(deletedUser).toBeNull();
  });
});
