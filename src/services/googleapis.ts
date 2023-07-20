import { google } from "googleapis";
import get from "lodash/get";

type VideoDetail = {
  title: string,
  description: string
}

export const getYoutube = () => google.youtube({
  version: "v3",
  auth: process.env.GOOGLE_API_KEY,
});

export const getYoutubeVideoDetails = async (videoId: string): Promise<VideoDetail> => {
  try {
    const response = await getYoutube().videos.list({
      part: "snippet",
      id: videoId,
    } as any);

    const video = response.data.items?.[0];
    const title = get(video, "snippet.title", "Untitled");
    const description = get(video, "snippet.description", "Unknown");

    return {
      title,
      description,
    };
  } catch (error) {
    console.error("Error fetching video details:", error);
    return {
      title: "Untitled",
      description: "Unknown",
    };
  }
};
