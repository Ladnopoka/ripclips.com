"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SuccessMessage } from "@/components/ui/SuccessMessage";
import { formatEmbedUrl } from "@/lib/utils";
import { 
  getPendingClips, 
  approveClip, 
  rejectClip, 
  deleteClip, 
  type ClipSubmission 
} from "@/lib/database";

// Admin user check - in production, this should be more robust
const ADMIN_EMAILS = ['ladnopokaa@gmail.com', 'ivanovworkbusiness@gmail.com'];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [pendingClips, setPendingClips] = useState<ClipSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [processingClips, setProcessingClips] = useState<Set<string>>(new Set());

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (!authLoading && user && !isAdmin) {
      router.push("/");
      return;
    }

    if (isAdmin) {
      loadPendingClips();
    }
  }, [user, authLoading, isAdmin, router]);

  const loadPendingClips = async () => {
    try {
      setLoading(true);
      setErrors([]);
      const clips = await getPendingClips();
      setPendingClips(clips);
    } catch (error) {
      console.error("Error loading pending clips:", error);
      setErrors(["Failed to load pending clips"]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (clipId: string) => {
    if (!user) return;
    
    setProcessingClips(prev => new Set(prev).add(clipId));
    try {
      await approveClip(clipId, user.displayName || user.email || "Admin");
      setSuccessMessage("Clip approved successfully!");
      setPendingClips(prev => prev.filter(clip => clip.id !== clipId));
    } catch (error) {
      console.error("Error approving clip:", error);
      setErrors(["Failed to approve clip"]);
    } finally {
      setProcessingClips(prev => {
        const newSet = new Set(prev);
        newSet.delete(clipId);
        return newSet;
      });
    }
  };

  const handleReject = async (clipId: string, reason: string = "Quality standards not met") => {
    if (!user) return;
    
    setProcessingClips(prev => new Set(prev).add(clipId));
    try {
      await rejectClip(clipId, user.displayName || user.email || "Admin", reason);
      setSuccessMessage("Clip rejected successfully!");
      setPendingClips(prev => prev.filter(clip => clip.id !== clipId));
    } catch (error) {
      console.error("Error rejecting clip:", error);
      setErrors(["Failed to reject clip"]);
    } finally {
      setProcessingClips(prev => {
        const newSet = new Set(prev);
        newSet.delete(clipId);
        return newSet;
      });
    }
  };

  const handleDelete = async (clipId: string) => {
    if (!user || !confirm("Are you sure you want to permanently delete this clip?")) return;
    
    setProcessingClips(prev => new Set(prev).add(clipId));
    try {
      await deleteClip(clipId);
      setSuccessMessage("Clip deleted successfully!");
      setPendingClips(prev => prev.filter(clip => clip.id !== clipId));
    } catch (error) {
      console.error("Error deleting clip:", error);
      setErrors(["Failed to delete clip"]);
    } finally {
      setProcessingClips(prev => {
        const newSet = new Set(prev);
        newSet.delete(clipId);
        return newSet;
      });
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-red-200">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-500 mb-2">💀 Admin Panel</h1>
          <p className="text-red-200">Review and moderate clip submissions</p>
        </div>

        <ErrorMessage errors={errors} className="mb-6" />
        <SuccessMessage message={successMessage} className="mb-6" />

        {loading ? (
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Pending Reviews ({pendingClips.length})
              </h2>
              <button
                onClick={loadPendingClips}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Refresh
              </button>
            </div>

            {pendingClips.length === 0 ? (
              <div className="bg-gradient-to-b from-gray-900 to-red-950/30 rounded-xl border border-red-900/50 p-8 text-center">
                <p className="text-red-200/70">🎉 No pending clips to review!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingClips.map((clip) => {
                  const isProcessing = processingClips.has(clip.id || "");
                  return (
                    <div key={clip.id} className="bg-gradient-to-b from-gray-900 to-red-950/30 rounded-xl border border-red-900/50 overflow-hidden">
                      {/* Clip Header */}
                      <div className="p-6 border-b border-red-900/30">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{clip.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-red-200/70">
                              <span>Game: <span className="text-red-400">{clip.game}</span></span>
                              <span>Streamer: <span className="text-red-400">{clip.streamer}</span></span>
                              <span>Submitted by: <span className="text-red-400">{clip.submittedBy}</span></span>
                              <span>Date: <span className="text-red-400">{clip.submittedAt?.toDate().toLocaleDateString()}</span></span>
                            </div>
                          </div>
                          <div className="text-xs bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded">
                            PENDING REVIEW
                          </div>
                        </div>
                        
                        {clip.description && (
                          <p className="text-red-200/70 mb-4">{clip.description}</p>
                        )}
                        
                        <div className="text-sm text-red-300 mb-4">
                          <strong>URL:</strong> <a href={clip.clipUrl} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">{clip.clipUrl}</a>
                        </div>
                      </div>

                      {/* Embedded Video Preview */}
                      <div className="bg-black">
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

                      {/* Admin Actions */}
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleApprove(clip.id || "")}
                              disabled={isProcessing}
                              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              {isProcessing ? <LoadingSpinner size="sm" /> : <span>✅</span>}
                              <span>Approve</span>
                            </button>
                            
                            <button
                              onClick={() => handleReject(clip.id || "")}
                              disabled={isProcessing}
                              className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              {isProcessing ? <LoadingSpinner size="sm" /> : <span>❌</span>}
                              <span>Reject</span>
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleDelete(clip.id || "")}
                            disabled={isProcessing}
                            className="flex items-center space-x-2 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            {isProcessing ? <LoadingSpinner size="sm" /> : <span>🗑️</span>}
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}