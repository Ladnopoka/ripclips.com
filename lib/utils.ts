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
    // Use multiple parent domains to handle different environments
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `https://clips.twitch.tv/embed?clip=${clipId}&parent=${currentHost}&parent=localhost&parent=ripclips.com&autoplay=false&muted=false`;
  }
  
  // Extract video ID from YouTube URL formats:
  // https://www.youtube.com/watch?v=VIDEO_ID&other_params
  // https://youtu.be/VIDEO_ID
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const youtubeMatch = clipUrl.match(youtubeRegex);
  
  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=0`;
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

// Interface for clip metadata
export interface ClipMetadata {
  title: string;
  streamer: string;
  game: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt?: string;
}

// Extract clip ID from Twitch URL
export const extractTwitchClipId = (url: string): string | null => {
  const twitchClipRegex = /(?:clips\.twitch\.tv\/|twitch\.tv\/\w+\/clip\/)([A-Za-z0-9_-]+)/;
  const match = url.match(twitchClipRegex);
  return match ? match[1] : null;
};

// Fetch Twitch clip metadata using Twitch API
export const fetchTwitchClipMetadata = async (clipUrl: string): Promise<ClipMetadata | null> => {
  try {
    const clipId = extractTwitchClipId(clipUrl);
    if (!clipId) {
      throw new Error('Invalid Twitch clip URL');
    }

    // Call our API route that handles Twitch API requests
    const response = await fetch('/api/twitch-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clipId }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch metadata from Twitch API');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return {
      title: data.title,
      streamer: data.streamer,
      game: data.game,
      thumbnailUrl: data.thumbnailUrl,
      duration: data.duration,
      createdAt: data.createdAt,
    };
  } catch (error) {
    console.error('Error fetching Twitch clip metadata:', error);
    return null;
  }
};