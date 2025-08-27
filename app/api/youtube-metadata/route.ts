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
    // IMPORTANT: Order matters! More specific matches must come first
    // Using exact game names as per YouTube search best practices
    const gameKeywords = [
      { keywords: ['path of exile 2', 'poe2', 'path of exile ii'], game: 'Path of Exile 2' },
      { keywords: ['diablo ii: resurrected', 'diablo 2: resurrected', 'diablo 2 resurrected'], game: 'Diablo 2' },
      { keywords: ['diablo iv', 'diablo 4'], game: 'Diablo 4' },  
      { keywords: ['diablo iii', 'diablo 3'], game: 'Diablo 3' },
      { keywords: ['diablo ii', 'diablo 2'], game: 'Diablo 2' },
      { keywords: ['path of exile'], game: 'Path of Exile' }, // After PoE2 check
      { keywords: ['last epoch'], game: 'Last Epoch' },
      { keywords: ['world of warcraft', 'wow classic', 'wow retail'], game: 'World of Warcraft' },
      { keywords: ['titan quest 2'], game: 'Titan Quest 2' },
    ];

    const searchText = (title + ' ' + description).toLowerCase();
    console.log('🎮 Game detection - searching in text:', searchText.substring(0, 200) + '...');
    
    for (const { keywords, game } of gameKeywords) {
      const matchedKeyword = keywords.find(keyword => {
        // Use word boundary regex for more precise matching
        const regex = new RegExp('\\b' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        return regex.test(searchText);
      });
      if (matchedKeyword) {
        console.log(`🎮 Game detected: "${game}" (matched keyword: "${matchedKeyword}")`);
        console.log(`🎮 Search text context: ...${searchText.substring(Math.max(0, searchText.indexOf(matchedKeyword.toLowerCase()) - 20), searchText.indexOf(matchedKeyword.toLowerCase()) + matchedKeyword.length + 20)}...`);
        return game;
      }
    }
    
    console.log('🎮 No game detected, defaulting to "Other"');
  }
  
  return 'Other';
}

// Get Twitch access token for IGDB API (same credentials)
async function getTwitchAccessToken(): Promise<string> {
  const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
    throw new Error('Twitch API credentials not configured');
  }

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get Twitch access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Twitch access token:', error);
    throw error;
  }
}

// Get game box art from IGDB API
async function getGameBoxArtFromIGDB(gameName: string): Promise<string | null> {
  if (gameName === 'Other') {
    return null;
  }

  try {
    const accessToken = await getTwitchAccessToken();
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;

    // Map game names to IGDB search queries
    const gameSearchMap: { [key: string]: string } = {
      'Path of Exile': 'Path of Exile',
      'Path of Exile 2': 'Path of Exile 2',
      'Diablo 4': 'Diablo IV',
      'Diablo 3': 'Diablo III', 
      'Diablo 2': 'Diablo II',
      'Last Epoch': 'Last Epoch',
      'World of Warcraft': 'World of Warcraft',
      'Titan Quest 2': 'Titan Quest 2',
    };

    const searchQuery = gameSearchMap[gameName] || gameName;
    console.log(`🎮 Searching IGDB for box art: "${searchQuery}"`);

    // Search for the game
    const searchResponse = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': TWITCH_CLIENT_ID!,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'text/plain',
      },
      body: `search "${searchQuery}"; fields name,cover.url; limit 1;`,
    });

    if (!searchResponse.ok) {
      console.error('🎮 Failed to search IGDB:', searchResponse.status);
      return null;
    }

    const games = await searchResponse.json();
    
    if (!games || games.length === 0) {
      console.log(`🎮 No IGDB results found for game: ${gameName}`);
      return null;
    }

    const game = games[0];
    if (game.cover?.url) {
      // Convert IGDB thumbnail URL to full size
      const boxArtUrl = game.cover.url.replace('t_thumb', 't_cover_big');
      console.log(`🎮 Found IGDB box art for "${gameName}": ${boxArtUrl}`);
      return `https:${boxArtUrl}`;
    }

    console.log(`🎮 No cover art found in IGDB for game: ${gameName}`);
    return null;
  } catch (error) {
    console.error(`🎮 Error fetching IGDB box art for ${gameName}:`, error);
    return null;
  }
}

// Get game box art with fallback system
async function getGameBoxArtUrl(gameName: string): Promise<string | null> {
  if (gameName === 'Other') {
    return null;
  }

  // Try IGDB first (proper game database)
  console.log(`🎮 Attempting to get box art for "${gameName}" from IGDB...`);
  const igdbUrl = await getGameBoxArtFromIGDB(gameName);
  if (igdbUrl) {
    return igdbUrl;
  }

  // Fallback to static URLs if IGDB fails
  console.log(`🎮 IGDB failed, using fallback box art for "${gameName}"`);
  const fallbackBoxArtMap: { [key: string]: string } = {
    'Path of Exile': 'https://static-cdn.jtvnw.net/ttv-boxart/29307-285x380.jpg',
    'Path of Exile 2': 'https://static-cdn.jtvnw.net/ttv-boxart/1003654309-285x380.jpg',
    'Diablo 4': 'https://static-cdn.jtvnw.net/ttv-boxart/515024-285x380.jpg',
    'Diablo 3': 'https://static-cdn.jtvnw.net/ttv-boxart/313558-285x380.jpg',
    'Diablo 2': 'https://static-cdn.jtvnw.net/ttv-boxart/1788326818-285x380.jpg',
    'Last Epoch': 'https://static-cdn.jtvnw.net/ttv-boxart/506415-285x380.jpg',
    'World of Warcraft': 'https://static-cdn.jtvnw.net/ttv-boxart/18122-285x380.jpg',
  };
  
  const fallbackUrl = fallbackBoxArtMap[gameName] || null;
  if (fallbackUrl) {
    console.log(`🎮 Using fallback box art for "${gameName}": ${fallbackUrl}`);
  } else {
    console.log(`🎮 No box art available for "${gameName}"`);
  }
  
  return fallbackUrl;
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
    
    // Fetch game box art dynamically from YouTube search
    const gameBoxArtUrl = await getGameBoxArtUrl(game);

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