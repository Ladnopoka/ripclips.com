"use client";

import { useState } from "react";
import { useAuthContext } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SuccessMessage } from "@/components/ui/SuccessMessage";
import { submitClip } from "@/lib/database";

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

  const validateClipUrl = (url: string) => {
    const twitchClipRegex = /^https:\/\/(?:clips\.twitch\.tv|www\.twitch\.tv\/\w+\/clip)\/[\w-]+/;
    const youtubeRegex = /^https:\/\/(?:www\.youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    return twitchClipRegex.test(url) || youtubeRegex.test(url);
  };

  const handleSubmit = async () => {
    setErrors([]);
    setSuccessMessage("");

    // Validation
    const validationErrors: string[] = [];
    if (!clipUrl.trim()) validationErrors.push("Clip URL is required");
    else if (!validateClipUrl(clipUrl)) validationErrors.push("Please enter a valid Twitch clip or YouTube URL");
    if (!title.trim()) validationErrors.push("Title is required");
    if (!game.trim()) validationErrors.push("Game is required");
    if (!streamer.trim()) validationErrors.push("Streamer name is required");

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
        submittedBy: user ? user.displayName || "Unknown User" : "Anonymous"
      };
      
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
              <input
                type="url"
                placeholder="https://clips.twitch.tv/... or https://youtube.com/watch?v=..."
                value={clipUrl}
                onChange={(e) => setClipUrl(e.target.value)}
                className="w-full bg-black border border-red-600 rounded-lg px-4 py-3 text-white focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg"
              />
              <p className="text-red-200/70 text-sm mt-1">
                Submit Twitch and YouTube clips
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Epic hardcore death, Boss fight disaster, Build failure, etc."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border border-red-600 rounded-lg px-4 py-3 text-white focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg"
              />
            </div>

            {/* Game */}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-2">
                Game
              </label>
              <select
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="w-full bg-black border border-red-600 rounded-lg px-4 py-3 text-white focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg"
              >
                <option value="">Select Game</option>
                <option value="Path of Exile">💀 Path of Exile</option>
                <option value="Path of Exile 2">🔥 Path of Exile 2</option>
                <option value="Last Epoch">⚰️ Last Epoch</option>
                <option value="Diablo 4">🔥 Diablo 4</option>
                <option value="Diablo 2">🩸 Diablo 3</option>
                <option value="Diablo 3">⚔️ Diablo 2</option>
                <option value="Titan Quest 2">⚡ Titan Quest 2</option>
                <option value="World of Warcraft">🏰 World of Warcraft</option>
                <option value="Other">🗡️ Other Games</option>
              </select>
            </div>

            {/* Streamer */}
            <div>
              <label className="block text-red-300 text-sm font-medium mb-2">
                Who RIP'd?
              </label>
              <input
                type="text"
                placeholder="Name of the fallen warrior (streamer/creator)"
                value={streamer}
                onChange={(e) => setStreamer(e.target.value)}
                className="w-full bg-black border border-red-600 rounded-lg px-4 py-3 text-white focus:border-red-400 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg"
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
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center shadow-xl border border-red-800"
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