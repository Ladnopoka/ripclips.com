"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/lib/AuthContext";
import { getApprovedClips, hasUserLikedClip, likeClip, unlikeClip, incrementViews, type ClipSubmission } from "@/lib/database";
import { formatEmbedUrl, formatTimestamp } from "@/lib/utils";

interface ClipCardProps {
  clip: ClipSubmission & { userHasLiked?: boolean };
  onLikeChange: (clipId: string, newLikedState: boolean, newLikeCount: number) => void;
}

const ClipCard: React.FC<ClipCardProps> = ({ clip, onLikeChange }) => {
  const [liked, setLiked] = useState(clip.userHasLiked || false);
  const [liking, setLiking] = useState(false);
  const [viewed, setViewed] = useState(false);
  const { user } = useAuthContext();

  // Track view when video iframe loads
  useEffect(() => {
    if (clip.id && !viewed) {
      incrementViews(clip.id).catch(console.error);
      setViewed(true);
    }
  }, [clip.id, viewed]);

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

  return (
    <div className="bg-gradient-to-b from-gray-900 to-red-950/30 rounded-xl border border-red-900/50 overflow-hidden shadow-2xl mb-6">
      {/* Clip Header */}
      <div className="p-4 border-b border-red-900/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {clip.streamer[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-red-300 font-medium">{clip.streamer}</h3>
              <p className="text-red-200/60 text-sm">{formatTimestamp(clip.submittedAt)}</p>
            </div>
          </div>
          <div className="text-red-400 text-sm font-medium">{clip.game}</div>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">{clip.title}</h2>
      </div>

      {/* Embedded Video */}
      <div className="relative bg-black">
        <iframe 
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
      <div className="p-4">
        <p className="text-red-200/70 mb-4">{clip.description}</p>
        
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
                  className="w-8 h-8"
                />
              ) : (
                <img
                  src="/alkLFG-2x.gif"
                  alt="Not liked"
                  className="w-8 h-8"
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

            <button className="flex items-center space-x-2 text-red-200/60 hover:text-red-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span>Share</span>
            </button>
          </div>
          
          <div className="text-red-200/60 text-sm">{clip.views} views</div>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClips = async () => {
      setLoading(true);
      try {
        const approvedClips = await getApprovedClips();
        
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

  return (
    <div className="min-h-screen bg-black">
      {/* Feed Container */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Feed Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">💀 Death Feed</h1>
          <p className="text-red-200/70">Witness the latest ARPG carnage</p>
        </div>

        {/* Clip Feed */}
        <div className="space-y-6">
          {clips.map((clip) => (
            <ClipCard key={clip.id} clip={clip} onLikeChange={handleLikeChange} />
          ))}

          {loading ? (
            <div className="bg-gradient-to-b from-gray-900 to-red-950/30 rounded-xl border border-red-900/50 p-8 text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-red-900/50 rounded-full mx-auto mb-4"></div>
                <p className="text-red-200/60">Loading deaths...</p>
              </div>
            </div>
          ) : clips.length === 0 ? (
            <div className="bg-gradient-to-b from-gray-900 to-red-950/30 rounded-xl border border-red-900/50 p-8 text-center">
              <div className="mb-4">💀</div>
              <p className="text-red-200/60 mb-4">No death clips yet!</p>
              <p className="text-red-200/40 text-sm">Be the first to submit an epic ARPG death</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}