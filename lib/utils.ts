// Shared utility functions

// Helper function to format video embed URLs (Twitch + YouTube)
export const formatEmbedUrl = (clipUrl: string): string => {
  // If already an embed URL, return as-is
  if (clipUrl.includes('clips.twitch.tv/embed') || clipUrl.includes('youtube.com/embed')) {
    return clipUrl;
  }
  
  // Extract clip ID from both Twitch URL formats:
  // Old: https://clips.twitch.tv/ClipID
  // New: https://www.twitch.tv/channel/clip/ClipID
  const twitchClipRegex = /(?:clips\.twitch\.tv\/|twitch\.tv\/\w+\/clip\/)([A-Za-z0-9_-]+)/;
  const twitchMatch = clipUrl.match(twitchClipRegex);
  
  if (twitchMatch && twitchMatch[1]) {
    const clipId = twitchMatch[1];
    return `https://clips.twitch.tv/embed?clip=${clipId}&parent=localhost`;
  }
  
  // Extract video ID from YouTube URL formats:
  // https://www.youtube.com/watch?v=VIDEO_ID&other_params
  // https://youtu.be/VIDEO_ID
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const youtubeMatch = clipUrl.match(youtubeRegex);
  
  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Return original URL if not a recognized format
  return clipUrl;
};

// Helper function to format timestamp
export const formatTimestamp = (timestamp: any): string => {
  if (!timestamp || !timestamp.toDate) return "Recently";
  
  const now = new Date();
  const clipDate = timestamp.toDate();
  const diffMs = now.getTime() - clipDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return clipDate.toLocaleDateString();
};