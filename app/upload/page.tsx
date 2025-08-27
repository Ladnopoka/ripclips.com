"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SuccessMessage } from "@/components/ui/SuccessMessage";
import { submitClip } from "@/lib/database";
import { fetchTwitchClipMetadata, extractTwitchClipId } from "@/lib/utils";

export default function SubmitClipPage() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [clipUrl, setClipUrl] = useState("");
  const [title, setTitle] = useState("");
  const [game, setGame] = useState("");
  const [description, setDescription] = useState("");
  const [streamer, setStreamer] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [metadataExtracted, setMetadataExtracted] = useState(false);
  const [streamerProfileImageUrl, setStreamerProfileImageUrl] = useState("");
  const [gameBoxArtUrl, setGameBoxArtUrl] = useState("");

  const validateClipUrl = (url: string) => {
    const twitchClipRegex = /^https:\/\/(?:clips\.twitch\.tv|www\.twitch\.tv\/\w+\/clip)\/[\w-]+/;
    const youtubeRegex = /^https:\/\/(?:www\.youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    return twitchClipRegex.test(url) || youtubeRegex.test(url);
  };

  // Auto-extract metadata when Twitch URL is entered
  const handleUrlChange = async (url: string) => {
    setClipUrl(url);
    setErrors([]);
    
    // Reset metadata extracted flag when URL changes
    setMetadataExtracted(false);
    setStreamerProfileImageUrl("");
    setGameBoxArtUrl("");
    
    // Check if it's a Twitch clip URL
    const clipId = extractTwitchClipId(url);
    if (clipId && url.trim() !== "") {
      setIsLoadingMetadata(true);
      try {
        const metadata = await fetchTwitchClipMetadata(url);
        console.log('📥 Frontend received metadata from API:', {
          streamerProfileImageUrl: metadata?.streamerProfileImageUrl,
          gameBoxArtUrl: metadata?.gameBoxArtUrl,
          hasStreamerImage: !!metadata?.streamerProfileImageUrl,
          hasGameBoxArt: !!metadata?.gameBoxArtUrl
        });
        
        if (metadata) {
          setTitle(metadata.title);
          setStreamer(metadata.streamer);
          setGame(metadata.game);
          setStreamerProfileImageUrl(metadata.streamerProfileImageUrl || "");
          setGameBoxArtUrl(metadata.gameBoxArtUrl || "");
          
          console.log('📝 Frontend state after setting image URLs:', {
            streamerProfileImageUrl: metadata.streamerProfileImageUrl || "",
            gameBoxArtUrl: metadata.gameBoxArtUrl || "",
          });
          
          setMetadataExtracted(true);
          setSuccessMessage("✨ Clip metadata extracted successfully!");
        } else {
          setErrors(["Could not extract metadata from this Twitch clip. Please fill in the details manually."]);
        }
      } catch (error) {
        console.error("Error extracting metadata:", error);
        setErrors(["Failed to extract clip metadata. Please fill in the details manually."]);
      } finally {
        setIsLoadingMetadata(false);
      }
    }
  };

  const handleSubmit = async () => {
    setErrors([]);
    setSuccessMessage("");

    // Validation
    const validationErrors: string[] = [];
    if (!clipUrl.trim()) validationErrors.push("Clip URL is required");
    else if (!validateClipUrl(clipUrl)) validationErrors.push("Please enter a valid Twitch clip or YouTube URL");
    
    // For non-Twitch clips or if metadata extraction failed, require manual input
    const isTwitchClip = extractTwitchClipId(clipUrl) !== null;
    if (!isTwitchClip || !metadataExtracted) {
      if (!title.trim()) validationErrors.push("Title is required");
      if (!game.trim()) validationErrors.push("Game is required");
      if (!streamer.trim()) validationErrors.push("Streamer name is required");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit to database
      const submissionData = {
        clipUrl,
        title,
        game,
        description,
        streamer,
        submittedBy: user ? user.displayName || "Unknown User" : "Anonymous",
        streamerProfileImageUrl: streamerProfileImageUrl || null,
        gameBoxArtUrl: gameBoxArtUrl || null
      };
      
      console.log('💾 Data being submitted to database:', {
        streamerProfileImageUrl: submissionData.streamerProfileImageUrl,
        gameBoxArtUrl: submissionData.gameBoxArtUrl,
        hasStreamerImage: !!submissionData.streamerProfileImageUrl,
        hasGameBoxArt: !!submissionData.gameBoxArtUrl
      });
      
      const clipId = await submitClip(submissionData);
      console.log("Clip submitted with ID:", clipId);
      
      setSuccessMessage(
        `💀 Death clip submitted successfully! Your submission has been added to the review queue. ` +
        `${user ? "You'll be credited as the submitter once approved." : "Consider registering to get credit for your submissions!"}`
      );
      
      // Reset form
      setClipUrl("");
      setTitle("");
      setGame("");
      setDescription("");
      setStreamer("");
    } catch (error) {
      console.error("Submission error:", error);
      setErrors(["Failed to submit clip to database. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Page is now accessible to all users

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-red-500 mb-6 drop-shadow-lg">💀 Submit RIP Clip</h1>
        <p className="text-xl text-red-200 mb-8">
          Share brutal ARPG RIPs from Twitch or YouTube!
        </p>

        {/* Authentication Status */}
        {!user && (
          <div className="mb-6 p-4 bg-red-950/30 rounded-lg border border-red-800/50">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-300">
                You can submit clips anonymously! <a href="/login" className="text-red-400 hover:underline">Log in</a> or <a href="/register" className="text-red-400 hover:underline">register</a> to get credit and interact with clips (vote, comment).
              </p>
            </div>
          </div>
        )}
        
        {user && (
          <div className="mb-6 p-4 bg-green-950/30 rounded-lg border border-green-800/50">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-300">
                Submitting as <strong>{user.displayName}</strong> - you&apos;ll get credit for this death clip!
              </p>
            </div>
          </div>
        )}
        
        <div className="bg-gradient-to-b from-gray-900 to-red-950/30 p-8 rounded-xl border border-red-900/50 shadow-2xl">
          <div className="space-y-6">
            {/* Clip URL */}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-2">
                Clip URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://clips.twitch.tv/... or https://youtube.com/watch?v=..."
                  value={clipUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  disabled={isLoadingMetadata}
                  className="w-full bg-black border border-red-600 rounded-lg px-4 py-3 text-white focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg disabled:opacity-50"
                />
                {isLoadingMetadata && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
              <p className="text-red-200/70 text-sm mt-1">
                {extractTwitchClipId(clipUrl) ? 
                  "✨ Twitch clips auto-fill metadata!" : 
                  "Submit Twitch and YouTube clips"
                }
              </p>
              {metadataExtracted && (
                <p className="text-green-400 text-xs mt-1">
                  ✅ Metadata extracted successfully - you can edit the details below if needed
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-2">
                Title {metadataExtracted && <span className="text-green-400 text-xs">(Auto-filled)</span>}
              </label>
              <input
                type="text"
                placeholder={metadataExtracted ? "Auto-filled from Twitch clip" : "Epic hardcore death, Boss fight disaster, Build failure, etc."}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full bg-black border rounded-lg px-4 py-3 text-white focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg ${
                  metadataExtracted ? 'border-green-600' : 'border-red-600'
                }`}
              />
            </div>

            {/* Game */}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-2">
                Game {metadataExtracted && <span className="text-green-400 text-xs">(Auto-filled)</span>}
              </label>
              {metadataExtracted && !["Path of Exile", "Path of Exile 2", "Last Epoch", "Diablo 4", "Diablo 3", "Diablo 2", "Titan Quest 2", "World of Warcraft"].includes(game) ? (
                <input
                  type="text"
                  placeholder="Game name auto-filled"
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="w-full bg-black border border-green-600 rounded-lg px-4 py-3 text-white focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg"
                />
              ) : (
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className={`w-full bg-black border rounded-lg px-4 py-3 text-white focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg ${
                    metadataExtracted ? 'border-green-600' : 'border-red-600'
                  }`}
                >
                  <option value="">Select Game</option>
                  <option value="Path of Exile">💀 Path of Exile</option>
                  <option value="Path of Exile 2">🔥 Path of Exile 2</option>
                  <option value="Last Epoch">⚰️ Last Epoch</option>
                  <option value="Diablo 4">🔥 Diablo 4</option>
                  <option value="Diablo 3">🩸 Diablo 3</option>
                  <option value="Diablo 2">⚔️ Diablo 2</option>
                  <option value="Titan Quest 2">⚡ Titan Quest 2</option>
                  <option value="World of Warcraft">🏰 World of Warcraft</option>
                  <option value="Other">🗡️ Other Games</option>
                </select>
              )}
            </div>

            {/* Streamer */}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-2">
                Who RIP'd? {metadataExtracted && <span className="text-green-400 text-xs">(Auto-filled)</span>}
              </label>
              <input
                type="text"
                placeholder={metadataExtracted ? "Auto-filled from Twitch clip" : "Name of the fallen warrior (streamer/creator)"}
                value={streamer}
                onChange={(e) => setStreamer(e.target.value)}
                className={`w-full bg-black border rounded-lg px-4 py-3 text-white focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg ${
                  metadataExtracted ? 'border-green-600' : 'border-red-600'
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-2">
                RIP Description (Optional)
              </label>
              <textarea
                placeholder="Describe the carnage... What led to this epic death? Build details, boss mechanics, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-black border border-red-600 rounded-lg px-4 py-3 text-white focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg"
              />
            </div>

            <ErrorMessage errors={errors} className="mb-4" />
            <SuccessMessage message={successMessage} className="mb-4" />

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center shadow-xl border border-red-800 cursor-pointer"
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : "🩸 Submit RIP Clip"}
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="mt-8 bg-gradient-to-b from-gray-900 to-red-950/30 p-6 rounded-xl border border-red-900/50 shadow-2xl">
          <h3 className="text-lg font-semibold text-red-300 mb-4">Example RIP URLs:</h3>
          <div className="space-y-2 text-sm">
            <div className="text-red-200/70">
              <strong className="text-red-400">Twitch Clip:</strong> https://clips.twitch.tv/BraveHelpfulDolphinCoolStoryBob
            </div>
            <div className="text-red-200/70">
              <strong className="text-red-400">YouTube:</strong> https://www.youtube.com/watch?v=dQw4w9WgXcQ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}