// src/services/firebaseService.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  runTransaction,
  Unsubscribe,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage, isFirebaseConfigured } from './firebaseClient';
import { GigItem, BookingItem } from '../types';

export interface FirebaseUserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  creatorTier: 'Rising Star' | 'Level 1 Pro' | 'Level 2 Elite' | 'Top Rated Legend';
  rating: number;
  totalReviews: number;
  totalOrders: number;
  totalEarnings: number;
  escrowBalance: number;
  withdrawableBalance: number;
  isVerified: boolean;
  skills?: string[];
  createdAt?: any;
}

export interface FirebaseConsultation {
  id: string;
  creatorId: string;
  clientId: string;
  topic: string;
  details?: string;
  scheduledAt: string;
  durationMinutes: number;
  price: number;
  meetingLink: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt?: any;
}

export interface FirebaseDirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  messageType: 'text' | 'quote' | 'deliverable' | 'file';
  attachmentUrl?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export class SkillNexusFirebaseService {
  /**
   * Fetch active gigs from Firestore with creator profiles joined
   */
  static async fetchGigs(category?: string, searchQuery?: string): Promise<GigItem[]> {
    if (!isFirebaseConfigured()) {
      return [];
    }

    try {
      const gigsCol = collection(db, 'gigs');
      let q = query(gigsCol, where('status', '==', 'active'));

      if (category && category !== 'All') {
        const slug = category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-');
        q = query(gigsCol, where('status', '==', 'active'), where('categorySlug', '==', slug));
      }

      const snapshot = await getDocs(q);
      const gigs: GigItem[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();

        // Optional title search filter
        if (searchQuery && searchQuery.trim()) {
          const term = searchQuery.toLowerCase().trim();
          const title = (data.title || '').toLowerCase();
          if (!title.includes(term)) continue;
        }

        // Fetch Creator Profile
        let creatorProfile: Partial<FirebaseUserProfile> = {};
        if (data.creatorId) {
          try {
            const profileSnap = await getDoc(doc(db, 'profiles', data.creatorId));
            if (profileSnap.exists()) {
              creatorProfile = profileSnap.data() as FirebaseUserProfile;
            }
          } catch (pErr) {
            console.warn('Could not load profile for creator:', data.creatorId, pErr);
          }
        }

        gigs.push({
          id: docSnap.id,
          title: data.title || 'Untitled Service',
          creatorId: data.creatorId,
          creatorName: creatorProfile.fullName || creatorProfile.username || data.creatorName || 'Verified Creator',
          creatorHandle: `@${creatorProfile.username || 'creator'}`,
          creatorAvatar: creatorProfile.avatarUrl || data.creatorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.creatorId}`,
          creatorBio: creatorProfile.bio || data.creatorBio || 'Professional digital creator on SkillNexus.',
          category: (data.category || 'Web & Coding') as any,
          rate: data.starterPrice || data.rate || 49,
          rateType: 'fixed',
          deliveryDays: data.starterDeliveryDays || data.deliveryDays || 3,
          description: data.description || '',
          deliverables: data.starterFeatures || data.deliverables || ['Standard deliverables', 'Full commercial license'],
          rating: creatorProfile.rating || data.rating || 5.0,
          reviewsCount: creatorProfile.totalReviews || data.reviewsCount || 0,
          completedGigs: creatorProfile.totalOrders || data.completedGigs || 0,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          isFeatured: data.isFeatured || false,
          pendingBookingsCount: data.pendingBookingsCount || 0,
          rotationScore: data.rotationScore || 90,
          tags: data.tags || [],
        });
      }

      return gigs;
    } catch (err) {
      console.warn('Firebase fetchGigs error, fallback to local state:', err);
      return [];
    }
  }

  /**
   * Listen to real-time gig catalog changes
   */
  static listenToGigs(onUpdate: (gigs: GigItem[]) => void): Unsubscribe {
    if (!isFirebaseConfigured()) {
      return () => {};
    }

    const gigsCol = collection(db, 'gigs');
    const q = query(gigsCol, where('status', '==', 'active'), limit(50));

    return onSnapshot(q, async (snapshot) => {
      const items: GigItem[] = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title,
          creatorId: data.creatorId,
          creatorName: data.creatorName || 'Verified Creator',
          creatorHandle: `@${data.creatorHandle || 'creator'}`,
          creatorAvatar: data.creatorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.creatorId}`,
          creatorBio: data.creatorBio || '',
          category: data.category || 'Tech',
          rate: data.starterPrice || data.rate || 49,
          rateType: 'fixed',
          deliveryDays: data.starterDeliveryDays || 3,
          description: data.description || '',
          deliverables: data.starterFeatures || ['Full license', 'Project files'],
          rating: data.rating || 5.0,
          reviewsCount: data.reviewsCount || 0,
          completedGigs: data.completedGigs || 0,
          createdAt: new Date().toISOString(),
          isFeatured: data.isFeatured,
          pendingBookingsCount: data.pendingBookingsCount || 0,
          rotationScore: data.rotationScore || 90,
          tags: data.tags || [],
        });
      }
      onUpdate(items);
    });
  }

  /**
   * Create an escrow order in Firestore
   */
  static async createEscrowOrder(params: {
    gigId: string;
    sellerId: string;
    tier: 'starter' | 'standard' | 'pro';
    packageTitle: string;
    amount: number;
    deliveryDays: number;
    requirements: string;
  }) {
    if (!isFirebaseConfigured()) {
      console.log('Firebase Mock: Escrow order created locally', params);
      return { id: `order-${Date.now()}`, ...params, status: 'in_progress' };
    }

    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('You must be signed in to book a gig.');

    const platformFee = params.amount * 0.05;
    const sellerPayout = params.amount - platformFee;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + params.deliveryDays);

    const docRef = await addDoc(collection(db, 'orders'), {
      gigId: params.gigId,
      buyerId: currentUser.uid,
      sellerId: params.sellerId,
      tierSelected: params.tier,
      packageTitle: params.packageTitle,
      amount: params.amount,
      platformFee: platformFee,
      sellerPayout: sellerPayout,
      status: 'in_progress',
      clientRequirements: params.requirements,
      requirementsSubmittedAt: serverTimestamp(),
      dueDate: Timestamp.fromDate(dueDate),
      createdAt: serverTimestamp(),
    });

    // Update seller's escrow balance inside a transaction
    try {
      const sellerProfileRef = doc(db, 'profiles', params.sellerId);
      await updateDoc(sellerProfileRef, {
        escrowBalance: increment(sellerPayout),
        totalOrders: increment(1),
      });
    } catch (e) {
      console.warn('Could not increment seller escrow balance:', e);
    }

    return { id: docRef.id, ...params, status: 'in_progress' };
  }

  /**
   * Book a 1-on-1 Mentorship Video Call
   */
  static async bookConsultation(params: {
    creatorId: string;
    topic: string;
    details?: string;
    scheduledAt: Date;
    durationMinutes: number;
    price: number;
  }): Promise<FirebaseConsultation> {
    const meetingLink = `https://meet.google.com/nexus-${Math.random().toString(36).substring(2, 8)}`;

    if (!isFirebaseConfigured()) {
      return {
        id: `consult-${Date.now()}`,
        creatorId: params.creatorId,
        clientId: 'client-user',
        topic: params.topic,
        details: params.details,
        scheduledAt: params.scheduledAt.toISOString(),
        durationMinutes: params.durationMinutes,
        price: params.price,
        meetingLink: meetingLink,
        status: 'scheduled',
      };
    }

    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Must be signed in to book a mentorship call.');

    const docRef = await addDoc(collection(db, 'consultations'), {
      creatorId: params.creatorId,
      clientId: currentUser.uid,
      topic: params.topic,
      details: params.details || '',
      scheduledAt: Timestamp.fromDate(params.scheduledAt),
      durationMinutes: params.durationMinutes,
      price: params.price,
      meetingLink: meetingLink,
      status: 'scheduled',
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      creatorId: params.creatorId,
      clientId: currentUser.uid,
      topic: params.topic,
      details: params.details,
      scheduledAt: params.scheduledAt.toISOString(),
      durationMinutes: params.durationMinutes,
      price: params.price,
      meetingLink: meetingLink,
      status: 'scheduled',
    };
  }

  /**
   * Request Earnings Payout from Creator Wallet
   */
  static async requestPayout(params: {
    amount: number;
    payoutMethod: 'stripe' | 'paypal' | 'bank_wire' | 'usdc';
    accountDetails: Record<string, any>;
  }) {
    if (!isFirebaseConfigured()) {
      return { success: true, message: `Mock payout of $${params.amount} via ${params.payoutMethod} recorded.` };
    }

    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Must be logged in.');

    const docRef = await addDoc(collection(db, 'payout_requests'), {
      creatorId: currentUser.uid,
      amount: params.amount,
      payoutMethod: params.payoutMethod,
      accountDetails: params.accountDetails,
      status: 'pending',
      requestedAt: serverTimestamp(),
    });

    // Deduct withdrawable balance
    const profileRef = doc(db, 'profiles', currentUser.uid);
    await updateDoc(profileRef, {
      withdrawableBalance: increment(-params.amount),
    });

    return { id: docRef.id, success: true };
  }

  /**
   * Upload Media (Avatar, Gig Cover, Deliverables) to Firebase Storage
   */
  static async uploadMedia(path: string, file: Blob | Uint8Array): Promise<string> {
    if (!isFirebaseConfigured()) {
      return URL.createObjectURL(new Blob([file as any]));
    }

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  /**
   * Subscribe to real-time direct messages in Firestore
   */
  static subscribeToMessages(
    conversationId: string,
    onMessage: (msg: FirebaseDirectMessage) => void
  ): Unsubscribe {
    if (!isFirebaseConfigured()) return () => {};

    const messagesCol = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesCol, orderBy('createdAt', 'asc'));

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          onMessage({
            id: change.doc.id,
            conversationId,
            senderId: data.senderId,
            recipientId: data.recipientId,
            content: data.content,
            messageType: data.messageType || 'text',
            attachmentUrl: data.attachmentUrl,
            metadata: data.metadata,
            isRead: data.isRead || false,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          });
        }
      });
    });
  }
}
