// lib/services/supabase_service.dart
import 'dart:typed_data';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/gig_model.dart';

class SkillNexusService {
  static SupabaseClient get client => Supabase.instance.client;

  // ===========================================================================
  // 1. GIGS & MARKETPLACE
  // ===========================================================================

  /// Fetch all popular categories
  static Future<List<Map<String, dynamic>>> fetchCategories() async {
    final res = await client
        .from('gig_categories')
        .select('*')
        .order('display_order', ascending: true);
    return List<Map<String, dynamic>>.from(res);
  }

  /// Fetch filtered marketplace gigs
  static Future<List<GigModel>> fetchGigs({
    String? categorySlug,
    String? searchQuery,
    double? maxPrice,
    String sortBy = 'rating', // 'rating', 'price_low', 'price_high', 'newest'
  }) async {
    var query = client
        .from('gigs')
        .select('*, profiles(username, full_name, avatar_url, creator_tier, rating, is_verified)')
        .eq('status', 'active');

    if (categorySlug != null && categorySlug.isNotEmpty) {
      query = query.eq('category_slug', categorySlug);
    }

    if (searchQuery != null && searchQuery.trim().isNotEmpty) {
      query = query.ilike('title', '%$searchQuery%');
    }

    if (maxPrice != null && maxPrice > 0) {
      query = query.lte('starter_price', maxPrice);
    }

    // Sorting
    PostgrestTransformBuilder transform;
    if (sortBy == 'price_low') {
      transform = query.order('starter_price', ascending: true);
    } else if (sortBy == 'price_high') {
      transform = query.order('starter_price', ascending: false);
    } else if (sortBy == 'newest') {
      transform = query.order('created_at', ascending: false);
    } else {
      transform = query.order('rating', ascending: false);
    }

    final res = await transform;
    return (res as List).map((json) => GigModel.fromJson(json)).toList();
  }

  /// Fetch single Gig by Slug or ID
  static Future<GigModel?> fetchGigById(String gigId) async {
    final res = await client
        .from('gigs')
        .select('*, profiles(*)')
        .eq('id', gigId)
        .maybeSingle();

    if (res == null) return null;
    return GigModel.fromJson(res);
  }

  // ===========================================================================
  // 2. ORDER BOOKINGS & ESCROW
  // ===========================================================================

  /// Create a new Gig Escrow Order
  static Future<Map<String, dynamic>> createOrder({
    required String gigId,
    required String sellerId,
    required String tierSelected, // 'starter', 'standard', 'pro'
    required String packageTitle,
    required double amount,
    required int deliveryDays,
    required String requirements,
  }) async {
    final buyerId = client.auth.currentUser?.id;
    if (buyerId == null) throw Exception('User must be logged in to order.');

    final platformFee = amount * 0.05; // 5% platform fee
    final sellerPayout = amount - platformFee;
    final dueDate = DateTime.now().add(Duration(days: deliveryDays));

    final res = await client.from('orders').insert({
      'gig_id': gigId,
      'buyer_id': buyerId,
      'seller_id': sellerId,
      'tier_selected': tierSelected,
      'package_title': packageTitle,
      'amount': amount,
      'platform_fee': platformFee,
      'seller_payout': sellerPayout,
      'status': 'in_progress',
      'client_requirements': requirements,
      'requirements_submitted_at': DateTime.now().toIso8601String(),
      'due_date': dueDate.toIso8601String(),
    }).select().single();

    return res;
  }

  /// Mark Order Delivered (by Creator)
  static Future<void> deliverOrder({
    required String orderId,
    required String deliveryNote,
    required List<String> deliveryFiles,
  }) async {
    await client.from('orders').update({
      'status': 'delivered',
      'delivery_note': deliveryNote,
      'delivery_files': deliveryFiles,
      'delivered_at': DateTime.now().toIso8601String(),
    }).eq('id', orderId);
  }

  /// Complete Order & Release Escrow (by Buyer)
  static Future<void> completeOrder(String orderId) async {
    await client.from('orders').update({
      'status': 'completed',
      'completed_at': DateTime.now().toIso8601String(),
    }).eq('id', orderId);
  }

  // ===========================================================================
  // 3. 1-ON-1 CONSULTATIONS
  // ===========================================================================

  /// Book a Live Consultation
  static Future<void> bookConsultation({
    required String creatorId,
    required String topic,
    required String details,
    required DateTime scheduledAt,
    required int durationMinutes,
    required double price,
  }) async {
    final clientId = client.auth.currentUser?.id;
    if (clientId == null) throw Exception('Must be logged in to book.');

    await client.from('consultations').insert({
      'creator_id': creatorId,
      'client_id': clientId,
      'topic': topic,
      'details': details,
      'scheduled_at': scheduledAt.toIso8601String(),
      'duration_minutes': durationMinutes,
      'price': price,
      'meeting_link': 'https://meet.google.com/new', // Auto-generated meeting link
      'status': 'scheduled',
    });
  }

  // ===========================================================================
  // 4. CREATOR WALLET & PAYOUTS
  // ===========================================================================

  /// Request Earnings Withdrawal
  static Future<void> requestPayout({
    required double amount,
    required String method,
    required Map<String, dynamic> accountDetails,
  }) async {
    final creatorId = client.auth.currentUser?.id;
    if (creatorId == null) throw Exception('Must be logged in.');

    await client.from('payout_requests').insert({
      'creator_id': creatorId,
      'amount': amount,
      'payout_method': method,
      'account_details': accountDetails,
      'status': 'pending',
    });
  }

  // ===========================================================================
  // 5. WEB-SAFE FILE UPLOAD (Uint8List)
  // ===========================================================================

  /// Upload file bytes to Supabase Storage
  static Future<String> uploadBinaryMedia({
    required String bucketName,
    required String path,
    required Uint8List bytes,
    String contentType = 'image/jpeg',
  }) async {
    await client.storage.from(bucketName).uploadBinary(
      path,
      bytes,
      fileOptions: FileOptions(contentType: contentType, upsert: true),
    );

    return client.storage.from(bucketName).getPublicUrl(path);
  }
}
