
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export async function fetchPlaylistVideos(playlistUrl) {
  const url = new URL(playlistUrl);
  const playlistId = url.searchParams.get("list");

  if (!playlistId) {
    throw new Error("Invalid YouTube playlist URL.");
  }

  // Step 1: Fetch up to 300 playlist videos using pagination
  const playlistItems = [];
  let nextPageToken;

  while (playlistItems.length < 300) {
    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      playlistId,
      maxResults: "50",
      key: API_KEY,
    });

    if (nextPageToken) {
      params.set("pageToken", nextPageToken);
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?${params}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Failed to fetch playlist."
      );
    }

    playlistItems.push(...(data.items ?? []));
    nextPageToken = data.nextPageToken;

    // Stop when the playlist ends
    if (!nextPageToken || !data.items?.length) {
      break;
    }
  }

  // Enforce the exact maximum of 300 videos
  const limitedItems = playlistItems.slice(0, 300);

  // Step 2: Fetch video durations in batches of 50
  const durationById = {};

  const videoIds = limitedItems
    .map((item) => item.contentDetails?.videoId)
    .filter(Boolean);

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);

    const videosParams = new URLSearchParams({
      part: "contentDetails",
      id: batch.join(","),
      key: API_KEY,
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${videosParams}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "Failed to fetch video durations."
      );
    }

    for (const video of data.items ?? []) {
      durationById[video.id] = video.contentDetails.duration;
    }
  }

  // Step 3: Return your lecture objects
  return limitedItems.map((item) => {
    const videoId = item.contentDetails.videoId;

    return {
      videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url,
      description: item.snippet.description,
      position: item.snippet.position,
      videoLink: `https://www.youtube.com/watch?v=${videoId}`,
      duration: durationById[videoId] ?? null,
      completed: false,
      completedAt: null,
    };
  });
}
