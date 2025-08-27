import { NextRequest, NextResponse } from 'next/server';

// YouTube API credentials - these should be environment variables
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Extract video ID from various YouTube URL formats
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Fetch video data from YouTube API
async function fetchVideoData(videoId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch video data from YouTube');
  }

  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found');
  }

  return data.items[0];
}

// Fetch channel data from YouTube API
async function fetchChannelData(channelId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=snippet&key=${YOUTUBE_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch channel data from YouTube');
  }

  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found');
  }

  return data.items[0];
}

// Map YouTube categories to game names (YouTube doesn't have direct game info)
function mapCategoryToGame(categoryId: string, title: string, description: string): string {
  // Common gaming category IDs in YouTube
  const gamingCategories = ['20']; // Gaming category
  
  if (gamingCategories.includes(categoryId)) {
    // Try to extract game name from title or description
    const gameKeywords = [
      { keywords: ['path of exile 2', 'poe2'], game: 'Path of Exile 2' },
      { keywords: ['path of exile', 'poe'], game: 'Path of Exile' },
      { keywords: ['diablo 4', 'diablo iv', 'd4'], game: 'Diablo 4' },
      { keywords: ['diablo 3', 'diablo iii', 'd3'], game: 'Diablo 3' },
      { keywords: ['diablo 2', 'diablo ii', 'd2', 'diablo 2 resurrected'], game: 'Diablo 2' },
      { keywords: ['last epoch', 'le'], game: 'Last Epoch' },
      { keywords: ['world of warcraft', 'wow'], game: 'World of Warcraft' },
      { keywords: ['titan quest 2'], game: 'Titan Quest 2' },
    ];

    const searchText = (title + ' ' + description).toLowerCase();
    
    for (const { keywords, game } of gameKeywords) {
      if (keywords.some(keyword => searchText.includes(keyword))) {
        return game;
      }
    }
  }
  
  return 'Other';
}

// Get game box art URL (since YouTube doesn't have game info, we'll use a placeholder or mapping)
function getGameBoxArtUrl(gameName: string): string | null {
  // This is a simplified approach - in production, you might want to use a game database API
  // or maintain your own mapping of game names to box art URLs
  const gameBoxArtMap: { [key: string]: string } = {
    'Path of Exile': 'https://static-cdn.jtvnw.net/ttv-boxart/29307-{width}x{height}.jpg',
    'Path of Exile 2': 'https://static-cdn.jtvnw.net/ttv-boxart/1003654309-{width}x{height}.jpg',
    'Diablo 4': 'https://static-cdn.jtvnw.net/ttv-boxart/515024-{width}x{height}.jpg',
    'Diablo 3': 'https://static-cdn.jtvnw.net/ttv-boxart/313558-{width}x{height}.jpg',
    'Diablo 2': 'https://static-cdn.jtvnw.net/ttv-boxart/1788326818-{width}x{height}.jpg',
    'Last Epoch': 'https://static-cdn.jtvnw.net/ttv-boxart/506415-{width}x{height}.jpg',
    'World of Warcraft': 'https://static-cdn.jtvnw.net/ttv-boxart/18122-{width}x{height}.jpg',
    'Titan Quest 2': 'https://static-cdn.jtvnw.net/ttv-boxart/1003654309-{width}x{height}.jpg', // placeholder
  };
  
  return gameBoxArtMap[gameName] || null;
}

export async function POST(request: NextRequest) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    if (!YOUTUBE_API_KEY) {
      throw new Error('YouTube API key not configured');
    }

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL or unable to extract video ID');
    }

    console.log('Extracted YouTube video ID:', videoId);

    // Fetch video data
    const videoData = await fetchVideoData(videoId);
    console.log('Raw video data from YouTube API:', JSON.stringify(videoData, null, 2));
    
    // Fetch channel data
    const channelData = await fetchChannelData(videoData.snippet.channelId);
    console.log('Raw channel data from YouTube API:', JSON.stringify(channelData, null, 2));
    
    // Determine game from video content
    const game = mapCategoryToGame(
      videoData.snippet.categoryId || '',
      videoData.snippet.title || '',
      videoData.snippet.description || ''
    );
    
    const gameBoxArtUrl = getGameBoxArtUrl(game);

    const metadata = {
      title: videoData.snippet.title,
      streamer: channelData.snippet.title, // Channel name
      game: game,
      thumbnailUrl: videoData.snippet.thumbnails?.maxres?.url || 
                   videoData.snippet.thumbnails?.high?.url || 
                   videoData.snippet.thumbnails?.medium?.url ||
                   videoData.snippet.thumbnails?.default?.url,
      duration: videoData.contentDetails.duration, // ISO 8601 duration format
      createdAt: videoData.snippet.publishedAt,
      streamerProfileImageUrl: channelData.snippet.thumbnails?.high?.url || 
                              channelData.snippet.thumbnails?.medium?.url ||
                              channelData.snippet.thumbnails?.default?.url,
      gameBoxArtUrl: gameBoxArtUrl,
    };

    console.log('Final YouTube metadata being returned:', JSON.stringify({
      streamerProfileImageUrl: metadata.streamerProfileImageUrl,
      gameBoxArtUrl: metadata.gameBoxArtUrl,
      hasStreamerImage: !!metadata.streamerProfileImageUrl,
      hasGameBoxArt: !!metadata.gameBoxArtUrl,
      game: metadata.game
    }, null, 2));

    return NextResponse.json(metadata);
    
  } catch (error) {
    console.error('Error in YouTube metadata API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch YouTube metadata' }, 
      { status: 500 }
    );
  }
}