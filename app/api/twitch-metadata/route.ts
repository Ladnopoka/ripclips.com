import { NextRequest, NextResponse } from 'next/server';

// Twitch API credentials - these should be environment variables
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

// Cache for access token
let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

// Get Twitch App Access Token
async function getTwitchAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken;
  }

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
    accessToken = data.access_token;
    // Set expiration to 5 minutes before actual expiry for safety
    tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;

    return accessToken;
  } catch (error) {
    console.error('Error getting Twitch access token:', error);
    throw error;
  }
}

// Fetch clip data from Twitch API
async function fetchClipData(clipId: string, token: string) {
  const response = await fetch(`https://api.twitch.tv/helix/clips?id=${clipId}`, {
    headers: {
      'Client-ID': TWITCH_CLIENT_ID!,
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch clip data from Twitch');
  }

  const data = await response.json();
  
  if (!data.data || data.data.length === 0) {
    throw new Error('Clip not found');
  }

  return data.data[0];
}

// Fetch broadcaster (streamer) data from Twitch API
async function fetchBroadcasterData(broadcasterId: string, token: string) {
  const response = await fetch(`https://api.twitch.tv/helix/users?id=${broadcasterId}`, {
    headers: {
      'Client-ID': TWITCH_CLIENT_ID!,
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch broadcaster data from Twitch');
  }

  const data = await response.json();
  
  if (!data.data || data.data.length === 0) {
    throw new Error('Broadcaster not found');
  }

  return data.data[0];
}

// Fetch game data from Twitch API using game_id
async function fetchGameData(gameId: string, token: string) {
  const response = await fetch(`https://api.twitch.tv/helix/games?id=${gameId}`, {
    headers: {
      'Client-ID': TWITCH_CLIENT_ID!,
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch game data from Twitch');
  }

  const data = await response.json();
  
  if (!data.data || data.data.length === 0) {
    throw new Error('Game not found');
  }

  return data.data[0];
}

export async function POST(request: NextRequest) {
  try {
    const { clipId } = await request.json();

    if (!clipId) {
      return NextResponse.json({ error: 'Clip ID is required' }, { status: 400 });
    }

    // Get access token
    const token = await getTwitchAccessToken();

    // Fetch clip data
    const clipData = await fetchClipData(clipId, token);
    
    // Fetch broadcaster data
    const broadcasterData = await fetchBroadcasterData(clipData.broadcaster_id, token);
    
    // Fetch game data using game_id from clip
    let gameData = null;
    if (clipData.game_id) {
      try {
        gameData = await fetchGameData(clipData.game_id, token);
      } catch (error) {
        console.error('Error fetching game data:', error);
        // Continue without game data, will fallback to "Other"
      }
    }

    // Format game name properly - maps official Twitch names to our standardized names
    const formatGameName = (gameName: string | null | undefined): string => {
      if (!gameName) {
        return 'Other';
      }
      
      // Map official Twitch game names to our standardized names
      const gameMap: { [key: string]: string } = {
        // Path of Exile games
        'path of exile': 'Path of Exile',
        'path of exile 2': 'Path of Exile 2',
        
        // Diablo games (using official Twitch names)
        'diablo iv': 'Diablo 4',
        'diablo iii': 'Diablo 3', 
        'diablo ii': 'Diablo 2',
        'diablo ii: resurrected': 'Diablo 2',
        
        // Other ARPG games
        'last epoch': 'Last Epoch',
        'world of warcraft': 'World of Warcraft',
        'titan quest 2': 'Titan Quest 2',
      };

      const normalizedName = gameName.toLowerCase();
      return gameMap[normalizedName] || gameName;
    };

    const metadata = {
      title: clipData.title,
      streamer: broadcasterData.display_name,
      game: formatGameName(gameData?.name),
      thumbnailUrl: clipData.thumbnail_url,
      duration: clipData.duration,
      createdAt: clipData.created_at,
      streamerProfileImageUrl: broadcasterData.profile_image_url,
      gameBoxArtUrl: gameData?.box_art_url,
    };

    return NextResponse.json(metadata);
    
  } catch (error) {
    console.error('Error in Twitch metadata API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch metadata' }, 
      { status: 500 }
    );
  }
}