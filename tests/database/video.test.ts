import { v4 as uuidv4 } from "uuid";
import { Video } from "@database/video";
import { User } from "@database/user";

import {
  videos, users, setupDatabaseBeforeAll, teardownDatabaseAfterAll, seedDatabaseBeforeEach,
} from "../__fixture__/db";

describe("Video", () => {
  beforeAll(setupDatabaseBeforeAll);
  afterAll(teardownDatabaseAfterAll);

  beforeEach(async () => {
    await seedDatabaseBeforeEach();
  });

  it("returns correct videos count", async () => {
    const totalVideos = videos.length;
    const totalCreatedVideos = await Video.count();

    expect(totalCreatedVideos).toBe(totalVideos);
  });

  it("creates a new video", async () => {
    const newVideoData = {
      userId: uuidv4(),
      url: "https://www.youtube.com/watch?v=newVideoId",
      title: "New Video",
      description: "New Description",
    };

    const createdVideo = await Video.create(newVideoData);

    expect(createdVideo.userId).toBe(newVideoData.userId);
    expect(createdVideo.url).toBe(newVideoData.url);
    expect(createdVideo.title).toBe(newVideoData.title);
    expect(createdVideo.description).toBe(newVideoData.description);
  });

  it("updates a video", async () => {
    const videoToUpdate = videos[0];
    const updatedTitle = "Updated Video Title";
    const updatedDescription = "Updated Video Description";

    await Video.update(
      { title: updatedTitle, description: updatedDescription },
      { where: { id: videoToUpdate.id } },
    );

    const updatedVideo = await Video.findByPk(videoToUpdate.id);

    expect(updatedVideo?.title).toBe(updatedTitle);
    expect(updatedVideo?.description).toBe(updatedDescription);
    expect(updatedVideo?.id).toBe(videoToUpdate.id);
    expect(updatedVideo?.userId).toBe(videoToUpdate.userId);
    expect(updatedVideo?.url).toBe(videoToUpdate.url);
  });

  it("retrieves the associated user for a video", async () => {
    const testVideo = videos[0];
    const testUser: any = users.find((user) => user.id === testVideo.userId);

    const videoWithUser: any = await Video.findByPk(testVideo.id, {
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    expect(videoWithUser.User).toBeTruthy();
    expect(videoWithUser.User.id).toBe(testUser.id);
    expect(videoWithUser.User.name).toBe(testUser.name);
    expect(videoWithUser.User.email).toBe(testUser.email);
  });

  it("deletes a video", async () => {
    const testVideo = videos[0];

    await Video.destroy({ where: { id: testVideo.id } });

    const deletedVideo = await Video.findByPk(testVideo.id);
    expect(deletedVideo).toBeNull();
  });

  it("does not delete the associated user when deleting a video", async () => {
    const testVideo = videos[0];

    await Video.destroy({ where: { id: testVideo.id } });

    const associatedUser = await User.findByPk(testVideo.userId);
    expect(associatedUser).toBeTruthy();
  });
});
