import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  deleteDoc,
  getDoc
} from 'firebase/firestore';

// TypeScript interfaces
export interface ClipSubmission {
  id?: string;
  clipUrl: string;
  title: string;
  game: string;
  description: string;
  streamer: string;
  submittedBy: string;
  submittedAt: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  rejectionReason?: string;
  likes?: number;
  views?: number;
  comments?: number;
  streamerProfileImageUrl?: string;
  gameBoxArtUrl?: string;
}

export interface ClipComment {
  id?: string;
  clipId: string;
  userId: string;
  userDisplayName: string;
  content: string;
  createdAt: Timestamp;
}

export interface ClipLike {
  id?: string;
  clipId: string;
  userId: string;
  createdAt: Timestamp;
}

// Collections
const CLIPS_COLLECTION = 'clip_submissions';
const COMMENTS_COLLECTION = 'clip_comments';
const LIKES_COLLECTION = 'clip_likes';

// Clip Submission Functions
export const submitClip = async (clipData: Omit<ClipSubmission, 'id' | 'submittedAt' | 'status' | 'likes' | 'views' | 'comments'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, CLIPS_COLLECTION), {
      ...clipData,
      submittedAt: Timestamp.now(),
      status: 'pending' as const,
      likes: 0,
      views: 0,
      comments: 0
    });
    console.log('Clip submitted with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting clip:', error);
    throw new Error('Failed to submit clip');
  }
};

export const getPendingClips = async (): Promise<ClipSubmission[]> => {
  try {
    const q = query(
      collection(db, CLIPS_COLLECTION),
      where('status', '==', 'pending'),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ClipSubmission));
  } catch (error) {
    console.error('Error fetching pending clips:', error);
    throw new Error('Failed to fetch pending clips');
  }
};

export const getApprovedClips = async (limitCount: number = 10): Promise<ClipSubmission[]> => {
  try {
    const q = query(
      collection(db, CLIPS_COLLECTION),
      where('status', '==', 'approved'),
      orderBy('submittedAt', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ClipSubmission));
  } catch (error) {
    console.error('Error fetching approved clips:', error);
    throw new Error('Failed to fetch approved clips');
  }
};

export const approveClip = async (clipId: string, reviewerName: string): Promise<void> => {
  try {
    const clipRef = doc(db, CLIPS_COLLECTION, clipId);
    await updateDoc(clipRef, {
      status: 'approved',
      reviewedBy: reviewerName,
      reviewedAt: Timestamp.now()
    });
    console.log('Clip approved:', clipId);
  } catch (error) {
    console.error('Error approving clip:', error);
    throw new Error('Failed to approve clip');
  }
};

export const rejectClip = async (clipId: string, reviewerName: string, reason: string): Promise<void> => {
  try {
    const clipRef = doc(db, CLIPS_COLLECTION, clipId);
    await updateDoc(clipRef, {
      status: 'rejected',
      reviewedBy: reviewerName,
      reviewedAt: Timestamp.now(),
      rejectionReason: reason
    });
    console.log('Clip rejected:', clipId);
  } catch (error) {
    console.error('Error rejecting clip:', error);
    throw new Error('Failed to reject clip');
  }
};

export const deleteClip = async (clipId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, CLIPS_COLLECTION, clipId));
    console.log('Clip deleted:', clipId);
  } catch (error) {
    console.error('Error deleting clip:', error);
    throw new Error('Failed to delete clip');
  }
};

// Like/Unlike Functions
export const likeClip = async (clipId: string, userId: string): Promise<void> => {
  try {
    // Add like record
    await addDoc(collection(db, LIKES_COLLECTION), {
      clipId,
      userId,
      createdAt: Timestamp.now()
    });
    
    // Increment like count on clip
    const clipRef = doc(db, CLIPS_COLLECTION, clipId);
    const clipSnap = await getDoc(clipRef);
    if (clipSnap.exists()) {
      const currentLikes = clipSnap.data().likes || 0;
      await updateDoc(clipRef, {
        likes: currentLikes + 1
      });
    }
  } catch (error) {
    console.error('Error liking clip:', error);
    throw new Error('Failed to like clip');
  }
};

export const unlikeClip = async (clipId: string, userId: string): Promise<void> => {
  try {
    // Find and delete like record
    const q = query(
      collection(db, LIKES_COLLECTION),
      where('clipId', '==', clipId),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.docs.forEach(async (likeDoc) => {
      await deleteDoc(likeDoc.ref);
    });
    
    // Decrement like count on clip
    const clipRef = doc(db, CLIPS_COLLECTION, clipId);
    const clipSnap = await getDoc(clipRef);
    if (clipSnap.exists()) {
      const currentLikes = clipSnap.data().likes || 0;
      await updateDoc(clipRef, {
        likes: Math.max(0, currentLikes - 1)
      });
    }
  } catch (error) {
    console.error('Error unliking clip:', error);
    throw new Error('Failed to unlike clip');
  }
};

export const hasUserLikedClip = async (clipId: string, userId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, LIKES_COLLECTION),
      where('clipId', '==', clipId),
      where('userId', '==', userId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if user liked clip:', error);
    return false;
  }
};

// Comment Functions
export const addComment = async (clipId: string, userId: string, userDisplayName: string, content: string): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
      clipId,
      userId,
      userDisplayName,
      content,
      createdAt: Timestamp.now()
    });
    
    // Increment comment count on clip
    const clipRef = doc(db, CLIPS_COLLECTION, clipId);
    const clipSnap = await getDoc(clipRef);
    if (clipSnap.exists()) {
      const currentComments = clipSnap.data().comments || 0;
      await updateDoc(clipRef, {
        comments: currentComments + 1
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw new Error('Failed to add comment');
  }
};

export const getClipComments = async (clipId: string): Promise<ClipComment[]> => {
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where('clipId', '==', clipId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ClipComment));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments');
  }
};

// View tracking
export const incrementViews = async (clipId: string): Promise<void> => {
  try {
    const clipRef = doc(db, CLIPS_COLLECTION, clipId);
    const clipSnap = await getDoc(clipRef);
    if (clipSnap.exists()) {
      const currentViews = clipSnap.data().views || 0;
      await updateDoc(clipRef, {
        views: currentViews + 1
      });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
    // Don't throw error for view tracking failures
  }
};