"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "@/lib/AuthContext";
import { getApprovedClips, hasUserLikedClip, likeClip, unlikeClip, incrementViews, type ClipSubmission } from "@/lib/database";
import { formatEmbedUrl, formatTimestamp } from "@/lib/utils";

interface ClipCardProps {
  clip: ClipSubmission & { userHasLiked?: boolean };
  onLikeChange: (clipId: string, newLikedState: boolean, newLikeCount: number) => void;
  isPlaying: boolean;
  onPlay: (clipId: string) => void;
}

const ClipCard: React.FC<ClipCardProps> = ({ clip, onLikeChange, isPlaying, onPlay }) => {
  const [liked, setLiked] = useState(clip.userHasLiked || false);
  const [liking, setLiking] = useState(false);
  const [viewed, setViewed] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const { user } = useAuthContext();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track view when video iframe loads
  useEffect(() => {
    if (clip.id && !viewed) {
      incrementViews(clip.id).catch(console.error);
      setViewed(true);
    }
  }, [clip.id, viewed]);

  // Force iframe reload when this clip should stop playing
  useEffect(() => {
    if (!isPlaying && clip.id) {
      setIframeKey(prev => prev + 1);
    }
  }, [isPlaying, clip.id]);

  // Dynamic scrolling animation for long titles
  useEffect(() => {
    if (clip.title.length > 20 && titleRef.current && containerRef.current) {
      const titleElement = titleRef.current;
      const containerElement = containerRef.current;
      
      const setupAnimation = () => {
        const containerWidth = containerElement.offsetWidth;
        const titleWidth = titleElement.scrollWidth;
        
        // Debug logging
        console.log(`Title: "${clip.title}"`, {
          containerWidth,
          titleWidth,
          ratio: titleWidth / containerWidth
        });
        
        if (titleWidth > containerWidth) {
          // Calculate the distance needed to scroll to show the entire title
          // Add a small buffer (10px) to ensure we see the very end
          const scrollDistance = titleWidth - containerWidth + 10;
          // Convert to percentage relative to the title width for CSS transform
          const scrollPercentage = (scrollDistance / titleWidth) * 100;
          
          console.log(`Scroll calculation:`, {
            scrollDistance,
            scrollPercentage,
            animationId: `title-scroll-${clip.id}`
          });
          
          // Create dynamic keyframes
          const keyframes = `
            @keyframes title-scroll-${clip.id} {
              0% { transform: translateX(0); }
              25% { transform: translateX(0); }
              75% { transform: translateX(-${scrollPercentage}%); }
              100% { transform: translateX(-${scrollPercentage}%); }
            }
          `;
          
          // Remove existing style if any
          const existingStyle = document.getElementById(`title-style-${clip.id}`);
          if (existingStyle) {
            existingStyle.remove();
          }
          
          // Add new style
          const styleElement = document.createElement('style');
          styleElement.id = `title-style-${clip.id}`;
          styleElement.textContent = keyframes;
          document.head.appendChild(styleElement);
          
          // Apply animation
          titleElement.style.animation = `title-scroll-${clip.id} 8s infinite ease-in-out`;
        }
      };
      
      // Setup animation after a brief delay to ensure elements are rendered
      const timeoutId = setTimeout(setupAnimation, 100);
      
      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        const styleElement = document.getElementById(`title-style-${clip.id}`);
        if (styleElement) {
          styleElement.remove();
        }
      };
    }
  }, [clip.title, clip.id]);

  const handleIframeClick = () => {
    if (clip.id) {
      onPlay(clip.id);
    }
  };

  const handleLike = async () => {
    if (!user || !clip.id) return;
    
    setLiking(true);
    try {
      if (liked) {
        await unlikeClip(clip.id, user.uid);
        setLiked(false);
        onLikeChange(clip.id, false, (clip.likes || 0) - 1);
      } else {
        await likeClip(clip.id, user.uid);
        setLiked(true);
        onLikeChange(clip.id, true, (clip.likes || 0) + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLiking(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(clip.clipUrl);
      setShowCopyTooltip(true);
      setTimeout(() => setShowCopyTooltip(false), 2000);
      console.log("Clip link copied to clipboard:", clip.clipUrl);
    } catch (error) {
      console.error("Failed to copy link:", error);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = clip.clipUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setShowCopyTooltip(true);
        setTimeout(() => setShowCopyTooltip(false), 2000);
        console.log("Clip link copied to clipboard (fallback):", clip.clipUrl);
      } catch (fallbackError) {
        console.error("Fallback copy also failed:", fallbackError);
      }
    }
  };

  // Debug logging to see what image URLs we have
  console.log(`📺 Clip data for ${clip.streamer} (ID: ${clip.id}):`, {
    streamerProfileImageUrl: clip.streamerProfileImageUrl,
    gameBoxArtUrl: clip.gameBoxArtUrl,
    hasStreamerImage: !!clip.streamerProfileImageUrl,
    hasGameBoxArt: !!clip.gameBoxArtUrl,
    submittedAt: clip.submittedAt?.toDate?.()?.toISOString() || 'Unknown date'
  });

  return (
    <div className="bg-gray-900 rounded-lg border border-red-900/30 overflow-hidden mb-3">
      {/* Clip Header - Single Compact Line */}
      <div className="p-3">
        <div className="flex items-center w-full gap-2">
          {/* Left Component - Streamer Info */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {clip.streamerProfileImageUrl ? (
              <img 
                src={clip.streamerProfileImageUrl} 
                alt={`${clip.streamer} profile`}
                className="w-6 h-6 rounded-full object-cover"
                onLoad={() => {
                  console.log('✅ Streamer profile image loaded successfully:', clip.streamerProfileImageUrl);
                }}
                onError={(e) => {
                  console.log('❌ Streamer profile image failed to load:', clip.streamerProfileImageUrl);
                  // Fallback to initial letter if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`w-6 h-6 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white text-xs font-medium ${clip.streamerProfileImageUrl ? 'hidden' : ''}`}>
              {clip.streamer[0].toUpperCase()}
            </div>
            <span className="text-red-300 font-medium text-sm">{clip.streamer}</span>
            <span className="text-red-200/40 text-xs">•</span>
            <span className="text-red-200/60 text-xs">{formatTimestamp(clip.submittedAt)}</span>
          </div>

          {/* Middle Component - Scrolling Title */}
          <div className="flex-1 flex justify-center min-w-0 px-2 hidden sm:flex">
            {clip.title.length > 20 ? (
              <div ref={containerRef} className="title-container max-w-xs">
                <h2 ref={titleRef} className="text-2xl font-bold text-red-500" style={{ whiteSpace: 'nowrap' }}>
                  {clip.title}
                </h2>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-red-500 text-center">
                {clip.title}
              </h2>
            )}
          </div>

          {/* Right Component - Game Info */}
          <div className="flex items-center space-x-2 flex-shrink-0 hidden sm:flex">
            {clip.gameBoxArtUrl && (() => {
              const processedUrl = clip.gameBoxArtUrl.replace('{width}', '40').replace('{height}', '54');
              console.log('🎮 Game box art URL processing:', {
                original: clip.gameBoxArtUrl,
                processed: processedUrl
              });
              return (
                <img 
                  src={processedUrl}
                  alt={`${clip.game} box art`}
                  className="w-5 h-7 object-cover rounded"
                  onLoad={() => {
                    console.log('✅ Game box art loaded successfully:', processedUrl);
                  }}
                  onError={(e) => {
                    console.log('❌ Game box art failed to load:', processedUrl);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              );
            })()}
            <span className="text-red-400 text-xs font-medium">{clip.game}</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-red-500 text-center sm:hidden">{clip.title}</h2>
      </div>

      {/* Embedded Video */}
      <div className="relative bg-black" onClick={handleIframeClick}>
        <iframe 
          key={iframeKey}
          src={formatEmbedUrl(clip.clipUrl)}
          frameBorder="0" 
          allowFullScreen 
          scrolling="no" 
          height="378" 
          width="100%"
          className="w-full"
          title={clip.title}
        />
      </div>

      {/* Clip Footer */}
      <div className="p-3">
        <p className="text-red-200/70 mb-3 text-sm">{clip.description}</p>
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={!user || liking}
              className={`flex items-center space-x-2 transition-colors ${
                liked 
                  ? 'text-red-400' 
                  : 'text-red-200/60 hover:text-red-400'
              } ${!user && 'cursor-not-allowed opacity-50'} ${liking && 'opacity-50'}`}
            >
              {liked ? (
                <img
                  src="/alkLFG-2x.gif"  // make sure this gif is saved with infinite loop
                  alt="Liked"
                  className="rounded-lg shadow-lg max-h-[400px] w-8 h-8"
                />
              ) : (
                <img
                  src="/alkLFG-2x.gif"
                  alt="Not liked"
                  className="rounded-lg w-8 h-8"
                />
              )}
              {/* {liking ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
              ) : (
                <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )} */}
              <span>{clip.likes || 0}</span>
            </button>

            {/* {liked ? (
              <img
                src="/alkLFG-2x.gif"  // make sure this gif is saved with infinite loop
                alt="Liked"
                className="w-5 h-5"
              />
            ) : (
              <img
                src="/alkLFG-2x.gif"
                alt="Not liked"
                className="w-5 h-5"
              />
            )}            
             */}
            {/* <button className="flex items-center space-x-2 text-red-200/60 hover:text-red-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.622-.389l-3.378 2.032 1.179-3.537A8 8 0 113 12z" />
              </svg>
              <span>{clip.comments || 0}</span>
            </button> */}

            <button 
              onClick={handleCopyLink}
              className="relative flex items-center space-x-2 text-red-200/60 hover:text-red-400 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="-ml-1">Copy Link</span>
              
              {/* Copy Success Tooltip */}
              {showCopyTooltip && (
                <div className="absolute -top-10 left-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap animate-fade-in" style={{ transform: 'translateX(-50%)' }}>
                  Link Copied!
                  <div className="absolute top-full left-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-600" style={{ transform: 'translateX(-50%)' }}></div>
                </div>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-red-200/60 text-sm">
              Submitted by {clip.submittedBy ? (
                <span className="text-red-300">{clip.submittedBy}</span>
              ) : (
                "anonymous"
              )}
            </div>
            <div className="text-red-200/60 text-sm">{clip.views} views</div>
          </div>
        </div>

        {/* Login prompt for non-authenticated users */}
        {!user && (
          <div className="mt-4 p-3 bg-red-950/30 rounded-lg border border-red-800/50">
            <p className="text-red-300 text-sm">
              💀 <a href="/login" className="text-red-400 hover:underline">Log in</a> or <a href="/register" className="text-red-400 hover:underline">join</a> to vote and comment on death clips
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Homepage() {
  const { user } = useAuthContext();
  const [clips, setClips] = useState<ClipSubmission[]>([]);
  const [filteredClips, setFilteredClips] = useState<ClipSubmission[]>([]);
  const [displayedClips, setDisplayedClips] = useState<ClipSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [playingClipId, setPlayingClipId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const CLIPS_PER_PAGE = 5;

  useEffect(() => {
    const fetchClips = async () => {
      setLoading(true);
      try {
        const approvedClips = await getApprovedClips(1000);
        
        // Check like status for each clip if user is logged in
        if (user && approvedClips.length > 0) {
          const clipsWithLikeStatus = await Promise.all(
            approvedClips.map(async (clip) => {
              if (clip.id) {
                const userHasLiked = await hasUserLikedClip(clip.id, user.uid);
                return { ...clip, userHasLiked };
              }
              return clip;
            })
          );
          setClips(clipsWithLikeStatus);
        } else {
          setClips(approvedClips);
        }
      } catch (error) {
        console.error("Failed to fetch clips:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClips();
  }, [user]);

  // Filter and sort clips when filters or clips change
  useEffect(() => {
    let filtered = [...clips];

    // Apply game filter
    if (selectedGame !== "all") {
      filtered = filtered.filter(clip => 
        clip.game.toLowerCase() === selectedGame.toLowerCase()
      );
    }

    // Apply sorting
    if (sortBy === "newest") {
      filtered.sort((a, b) => {
        const dateA = a.submittedAt?.toDate?.() || new Date(0);
        const dateB = b.submittedAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (sortBy === "most-liked") {
      filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortBy === "most-viewed") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "hot") {
      // Hot algorithm: combines likes, views, comments with time decay
      filtered.sort((a, b) => {
        const calculateHotScore = (clip: ClipSubmission) => {
          const likes = clip.likes || 0;
          const views = clip.views || 0;
          const comments = clip.comments || 0;
          const submissionDate = clip.submittedAt?.toDate?.() || new Date(0);
          const now = new Date();
          const hoursSinceSubmission = (now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60);
          
          // Weighted engagement score
          const engagementScore = (likes * 3) + (comments * 2) + (views * 0.1);
          
          // Time decay: clips lose hotness over time
          const timeFactor = Math.max(0.1, 1 / (1 + hoursSinceSubmission / 24)); // Decay over days
          
          return engagementScore * timeFactor;
        };
        
        return calculateHotScore(b) - calculateHotScore(a);
      });
    }

    setFilteredClips(filtered);
    // Reset pagination when filters change
    setCurrentPage(0);
    setHasMore(true);
  }, [clips, selectedGame, sortBy]);

  // Update displayed clips when filtered clips or current page changes
  useEffect(() => {
    console.log(`Pagination update: currentPage=${currentPage}, totalFiltered=${filteredClips.length}`);
    
    if (currentPage === 0) {
      // Initial load - show first batch
      const initialClips = filteredClips.slice(0, CLIPS_PER_PAGE);
      console.log(`Initial load: showing ${initialClips.length} clips`);
      setDisplayedClips(initialClips);
      setHasMore(CLIPS_PER_PAGE < filteredClips.length);
    } else {
      // Load more - append new clips to existing ones
      const startIndex = currentPage * CLIPS_PER_PAGE;
      const endIndex = startIndex + CLIPS_PER_PAGE;
      const newClips = filteredClips.slice(startIndex, endIndex);
      
      console.log(`Loading more: page ${currentPage}, adding ${newClips.length} clips (indices ${startIndex}-${endIndex-1})`);
      setDisplayedClips(prev => {
        const updated = [...prev, ...newClips];
        console.log(`Total displayed clips: ${updated.length}`);
        return updated;
      });
      setHasMore(endIndex < filteredClips.length);
    }
  }, [filteredClips, currentPage, CLIPS_PER_PAGE]);

  // Load more clips function
  const loadMoreClips = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      // Simulate loading delay (you can remove this in production)
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setLoadingMore(false);
      }, 300);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    const observerTarget = document.getElementById('load-more-trigger');
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreClips();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
    };
  }, [hasMore, loadingMore, loading]);

  // Handler for updating like state in the UI
  const handleLikeChange = (clipId: string, newLikedState: boolean, newLikeCount: number) => {
    setClips((prevClips) =>
      prevClips.map((clip) =>
        clip.id === clipId
          ? { ...clip, userHasLiked: newLikedState, likes: newLikeCount }
          : clip
      )
    );
  };

  // Handler for when a clip starts playing
  const handleClipPlay = (clipId: string) => {
    setPlayingClipId(clipId);
  };

  return (
    <div className="min-h-screen">
      {/* Feed Container */}
      <div className="max-w-2xl mx-auto px-2 py-4">
        {/* Feed Header */}
        <div className="mb-1 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-3 flex items-center justify-center gap-2">
            <img src="/nowae-4x.webp" alt="Death" className="rounded-lg w-10 h-10" />
            RIP Clip Feed
          </h1>
          
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
            {/* Game Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-red-200/70 text-sm font-medium">Game:</label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="bg-black border border-red-600/50 text-red-200 px-3 py-2 rounded-lg text-sm focus:border-red-400 focus:ring-1 focus:ring-red-500 focus:outline-none"
              >
                <option value="all">All Games</option>
                <option value="path of exile">Path of Exile</option>
                <option value="path of exile 2">Path of Exile 2</option>
                <option value="last epoch">Last Epoch</option>
                <option value="diablo 4">Diablo 4</option>
                <option value="diablo 2">Diablo 2</option>
                <option value="titan quest 2">Titan Quest 2</option>
                <option value="world of warcraft">World of Warcraft</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-red-200/70 text-sm font-medium">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black border border-red-600/50 text-red-200 px-3 py-2 rounded-lg text-sm focus:border-red-400 focus:ring-1 focus:ring-red-500 focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="hot">Hot</option>
                <option value="most-liked">Likes</option>
                <option value="most-viewed">Views</option>
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <p className="text-red-200/50 text-sm">
            {loading ? "Loading..." : 
              `${displayedClips.length} of ${filteredClips.length} ${filteredClips.length === 1 ? 'death' : 'deaths'}${hasMore ? ' (scroll for more)' : ''}`
            }
          </p>
        </div>

        {/* Clip Feed */}
        <div className="space-y-3">
          {displayedClips.map((clip) => (
            <ClipCard 
              key={clip.id} 
              clip={clip} 
              onLikeChange={handleLikeChange}
              isPlaying={playingClipId === clip.id}
              onPlay={handleClipPlay}
            />
          ))}

          {/* Load More Trigger - invisible element for intersection observer */}
          {hasMore && !loading && (
            <div id="load-more-trigger" className="h-1"></div>
          )}

          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="bg-gray-900 rounded-lg border border-red-900/30 p-4 text-center">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-red-900/50 rounded-full mx-auto mb-2"></div>
                <p className="text-red-200/60 text-sm">Loading more RIPs...</p>
              </div>
            </div>
          )}

          {/* Load More Button - fallback for manual loading */}
          {!loadingMore && hasMore && !loading && displayedClips.length > 0 && (
            <div className="text-center py-4">
              <button
                onClick={loadMoreClips}
                className="bg-red-900/30 hover:bg-red-800/40 border border-red-600/50 text-red-200 px-6 py-3 rounded-lg transition-colors"
              >
                Load More RIPs
              </button>
            </div>
          )}

          {/* Initial Loading */}
          {loading ? (
            <div className="bg-gray-900 rounded-lg border border-red-900/30 p-6 text-center">
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-red-900/50 rounded-full mx-auto mb-3"></div>
                <p className="text-red-200/60 text-sm">Loading RIPs...</p>
              </div>
            </div>
          ) : displayedClips.length === 0 && filteredClips.length === 0 ? (
            <div className="bg-gray-900 rounded-lg border border-red-900/30 p-6 text-center">
              <div className="mb-4">💀</div>
              {clips.length === 0 ? (
                <>
                  <p className="text-red-200/60 mb-3 text-sm">No RIPs yet!</p>
                  <p className="text-red-200/40 text-xs">Be the first to submit an epic ARPG RIP</p>
                </>
              ) : (
                <>
                  <p className="text-red-200/60 mb-3 text-sm">No RIPs found for these filters</p>
                  <p className="text-red-200/40 text-xs">Try adjusting your game or sorting options</p>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}