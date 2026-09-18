// src/services/supabaseService.ts
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { GigItem, BookingItem } from '../types';

export interface SupabaseProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  creator_tier: 'Rising Star' | 'Level 1 Pro' | 'Level 2 Elite' | 'Top Rated Legend';
  rating: number;
  total_reviews: number;
  total_orders: number;
  total_earnings: number;
  escrow_balance: number;
  withdrawable_balance: number;
  is_verified: boolean;
}

export interface SupabaseConsultation {
  id: string;
  creator_id: string;
  client_id: string;
  topic: string;
  details?: string;
  scheduled_at: string;
  duration_minutes: number;
  price: number;
  meeting_link: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface SupabaseDirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: 'text' | 'quote' | 'deliverable' | 'file';
  attachment_url?: string;
  metadata?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export class SkillNexusDataService {
  /**
   * Fetch all active gigs with profiles joined
   */
  static async fetchGigs(category?: string, searchQuery?: string): Promise<GigItem[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      let query = supabase
        .from('gigs')
        .select(`
          *,
          profiles (
            id, username, full_name, avatar_url, bio, creator_tier, rating, total_reviews, total_orders, is_verified
          )
        `)
        .eq('status', 'active');

      if (category && category !== 'All') {
        query = query.eq('category_slug', category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'));
      }

      if (searchQuery && searchQuery.trim()) {
        query = query.ilike('title', `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        creatorId: row.creator_id,
        creatorName: row.profiles?.full_name || row.profiles?.username || 'Verified Creator',
        creatorHandle: `@${row.profiles?.username || 'creator'}`,
        creatorAvatar: row.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.creator_id}`,
        creatorBio: row.profiles?.bio || 'Professional creator and digital specialist.',
        category: (row.category_slug || 'Tech') as any,
        rate: row.starter_price || 49,
        rateType: 'fixed',
        deliveryDays: row.starter_delivery_days || 3,
        description: row.description || '',
        deliverables: row.starter_features || ['Standard project files', 'Full commercial license'],
        rating: row.rating || 5.0,
        reviewsCount: row.total_reviews || 0,
        completedGigs: row.total_orders || 0,
        createdAt: row.created_at,
        isFeatured: row.is_featured,
        pendingBookingsCount: 0,
        rotationScore: 90,
        tags: row.tags || [],
      }));
    } catch (err) {
      console.warn('Supabase fetchGigs failed, falling back to local state:', err);
      return [];
    }
  }

  /**
   * Create an escrow order booking
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
    if (!isSupabaseConfigured()) {
      console.log('Mock: Escrow order created locally', params);
      return { id: `order-${Date.now()}`, ...params, status: 'in_progress' };
    }

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('You must be logged in to book a gig.');

    const platformFee = params.amount * 0.05;
    const sellerPayout = params.amount - platformFee;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + params.deliveryDays);

    const { data, error } = await supabase
      .from('orders')
      .insert({
        gig_id: params.gigId,
        buyer_id: user.id,
        seller_id: params.sellerId,
        tier_selected: params.tier,
        package_title: params.packageTitle,
        amount: params.amount,
        platform_fee: platformFee,
        seller_payout: sellerPayout,
        status: 'in_progress',
        client_requirements: params.requirements,
        requirements_submitted_at: new Date().toISOString(),
        due_date: dueDate.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
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
  }): Promise<SupabaseConsultation> {
    const meetingLink = `https://meet.google.com/nexus-${Math.random().toString(36).substring(2, 8)}`;

    if (!isSupabaseConfigured()) {
      return {
        id: `consult-${Date.now()}`,
        creator_id: params.creatorId,
        client_id: 'client-user',
        topic: params.topic,
        details: params.details,
        scheduled_at: params.scheduledAt.toISOString(),
        duration_minutes: params.durationMinutes,
        price: params.price,
        meeting_link: meetingLink,
        status: 'scheduled',
      };
    }

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Must be signed in to book a consultation.');

    const { data, error } = await supabase
      .from('consultations')
      .insert({
        creator_id: params.creatorId,
        client_id: user.id,
        topic: params.topic,
        details: params.details,
        scheduled_at: params.scheduledAt.toISOString(),
        duration_minutes: params.durationMinutes,
        price: params.price,
        meeting_link: meetingLink,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Request Earnings Payout from Creator Wallet
   */
  static async requestPayout(params: {
    amount: number;
    payoutMethod: 'stripe' | 'paypal' | 'bank_wire' | 'usdc';
    accountDetails: Record<string, any>;
  }) {
    if (!isSupabaseConfigured()) {
      return { success: true, message: `Mock payout of $${params.amount} via ${params.payoutMethod} recorded.` };
    }

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Must be logged in.');

    const { data, error } = await supabase
      .from('payout_requests')
      .insert({
        creator_id: user.id,
        amount: params.amount,
        payout_method: params.payoutMethod,
        account_details: params.accountDetails,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Subscribe to real-time direct messages
   */
  static subscribeToMessages(conversationId: string, onMessage: (msg: SupabaseDirectMessage) => void) {
    if (!isSupabaseConfigured()) return () => {};

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          onMessage(payload.new as SupabaseDirectMessage);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}
