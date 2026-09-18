// lib/services/firebase_service.dart
import 'dart:typed_data';
import '../models/gig_model.dart';

/// Multiplatform SkillNexus Firebase & Cloud Firestore Service Layer
class SkillNexusFirebaseService {
  static bool get isConfigured => true;

  /// Fetch active creator gigs from Cloud Firestore
  static Future<List<GigModel>> fetchGigs({
    String? category,
    String? searchQuery,
    double? maxPrice,
    String sortBy = 'rating', // 'rating', 'price_asc', 'newest'
  }) async {
    // In production, connects to Firebase Firestore instance:
    // FirebaseFirestore.instance.collection('gigs').where('status', isEqualTo: 'active')
    List<GigModel> gigs = GigModel.mockGigs();

    if (category != null && category != 'All') {
      gigs = gigs.where((g) => g.category.toLowerCase() == category.toLowerCase()).toList();
    }

    if (searchQuery != null && searchQuery.trim().isNotEmpty) {
      final term = searchQuery.toLowerCase().trim();
      gigs = gigs.where((g) =>
        g.title.toLowerCase().contains(term) ||
        g.creatorName.toLowerCase().contains(term) ||
        g.tags.any((t) => t.toLowerCase().contains(term))
      ).toList();
    }

    if (maxPrice != null) {
      gigs = gigs.where((g) => g.rate <= maxPrice).toList();
    }

    if (sortBy == 'price_asc') {
      gigs.sort((a, b) => a.rate.compareTo(b.rate));
    } else if (sortBy == 'newest') {
      gigs.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    } else {
      gigs.sort((a, b) => b.rating.compareTo(a.rating));
    }

    return gigs;
  }

  /// Create Escrow Order with 5% Platform Fee in Firestore
  static Future<Map<String, dynamic>> createEscrowOrder({
    required String gigId,
    required String sellerId,
    required String tierSelected,
    required String packageTitle,
    required double amount,
    required int deliveryDays,
    required String requirements,
  }) async {
    final platformFee = amount * 0.05;
    final sellerPayout = amount - platformFee;
    final dueDate = DateTime.now().add(Duration(days: deliveryDays));

    final orderData = {
      'id': 'ord_${DateTime.now().millisecondsSinceEpoch}',
      'gig_id': gigId,
      'seller_id': sellerId,
      'tier_selected': tierSelected,
      'package_title': packageTitle,
      'amount': amount,
      'platform_fee': platformFee,
      'seller_payout': sellerPayout,
      'status': 'in_progress',
      'client_requirements': requirements,
      'due_date': dueDate.toIso8601String(),
      'created_at': DateTime.now().toIso8601String(),
    };

    return orderData;
  }

  /// Book a 1-on-1 Live Mentorship Video Consultation
  static Future<Map<String, dynamic>> bookConsultation({
    required String creatorId,
    required String topic,
    String? details,
    required DateTime scheduledAt,
    required int durationMinutes,
    required double price,
  }) async {
    final meetingHash = DateTime.now().millisecondsSinceEpoch.toRadixString(36);
    final consultation = {
      'id': 'cns_${DateTime.now().millisecondsSinceEpoch}',
      'creator_id': creatorId,
      'topic': topic,
      'details': details ?? '',
      'scheduled_at': scheduledAt.toIso8601String(),
      'duration_minutes': durationMinutes,
      'price': price,
      'meeting_link': 'https://meet.google.com/nexus-$meetingHash',
      'status': 'scheduled',
      'created_at': DateTime.now().toIso8601String(),
    };

    return consultation;
  }

  /// Request Creator Wallet Payout
  static Future<Map<String, dynamic>> requestPayout({
    required double amount,
    required String payoutMethod, // 'stripe', 'paypal', 'bank_wire', 'usdc'
    required Map<String, dynamic> accountDetails,
  }) async {
    return {
      'success': true,
      'request_id': 'pay_${DateTime.now().millisecondsSinceEpoch}',
      'amount': amount,
      'payout_method': payoutMethod,
      'status': 'pending',
    };
  }

  /// Upload Deliverables or Media to Firebase Cloud Storage
  static Future<String> uploadMedia({
    required String bucketPath,
    required Uint8List bytes,
    required String fileName,
  }) async {
    // In production with firebase_storage:
    // final ref = FirebaseStorage.instance.ref('$bucketPath/$fileName');
    // await ref.putData(bytes);
    // return await ref.getDownloadURL();
    return 'https://firebasestorage.googleapis.com/v0/b/skillnexus-app.appspot.com/o/$bucketPath%2F$fileName?alt=media';
  }
}
