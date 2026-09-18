// lib/models/gig_model.dart
class GigModel {
  final String id;
  final String creatorId;
  final String categorySlug;
  final String title;
  final String slug;
  final String description;
  final List<String> tags;
  final String coverImage;
  final List<String> galleryImages;
  final String? videoPreviewUrl;

  // Starter Tier
  final double starterPrice;
  final String starterTitle;
  final String starterDesc;
  final int starterDeliveryDays;
  final int starterRevisions;
  final List<String> starterFeatures;

  // Standard Tier
  final double standardPrice;
  final String standardTitle;
  final String standardDesc;
  final int standardDeliveryDays;
  final int standardRevisions;
  final List<String> standardFeatures;

  // Pro Tier
  final double proPrice;
  final String proTitle;
  final String proDesc;
  final int proDeliveryDays;
  final int proRevisions;
  final List<String> proFeatures;

  final double rating;
  final int totalReviews;
  final int totalOrders;
  final bool isFeatured;
  final String status;
  final DateTime createdAt;

  // Joined Creator Profile
  final Map<String, dynamic>? creatorProfile;

  GigModel({
    required this.id,
    required this.creatorId,
    required this.categorySlug,
    required this.title,
    required this.slug,
    required this.description,
    required this.tags,
    required this.coverImage,
    required this.galleryImages,
    this.videoPreviewUrl,
    required this.starterPrice,
    required this.starterTitle,
    required this.starterDesc,
    required this.starterDeliveryDays,
    required this.starterRevisions,
    required this.starterFeatures,
    required this.standardPrice,
    required this.standardTitle,
    required this.standardDesc,
    required this.standardDeliveryDays,
    required this.standardRevisions,
    required this.standardFeatures,
    required this.proPrice,
    required this.proTitle,
    required this.proDesc,
    required this.proDeliveryDays,
    required this.proRevisions,
    required this.proFeatures,
    required this.rating,
    required this.totalReviews,
    required this.totalOrders,
    required this.isFeatured,
    required this.status,
    required this.createdAt,
    this.creatorProfile,
  });

  factory GigModel.fromJson(Map<String, dynamic> json) {
    return GigModel(
      id: json['id']?.toString() ?? '',
      creatorId: json['creator_id']?.toString() ?? '',
      categorySlug: json['category_slug']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      slug: json['slug']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      tags: List<String>.from(json['tags'] ?? []),
      coverImage: json['cover_image']?.toString() ?? 'https://picsum.photos/800/600',
      galleryImages: List<String>.from(json['gallery_images'] ?? []),
      videoPreviewUrl: json['video_preview_url']?.toString(),

      starterPrice: (json['starter_price'] as num?)?.toDouble() ?? 49.0,
      starterTitle: json['starter_title']?.toString() ?? 'Starter Tier',
      starterDesc: json['starter_desc']?.toString() ?? 'Core basic deliverables',
      starterDeliveryDays: (json['starter_delivery_days'] as num?)?.toInt() ?? 3,
      starterRevisions: (json['starter_revisions'] as num?)?.toInt() ?? 1,
      starterFeatures: List<String>.from(json['starter_features'] ?? []),

      standardPrice: (json['standard_price'] as num?)?.toDouble() ?? 99.0,
      standardTitle: json['standard_title']?.toString() ?? 'Standard Tier',
      standardDesc: json['standard_desc']?.toString() ?? 'Complete production package',
      standardDeliveryDays: (json['standard_delivery_days'] as num?)?.toInt() ?? 5,
      standardRevisions: (json['standard_revisions'] as num?)?.toInt() ?? 3,
      standardFeatures: List<String>.from(json['standard_features'] ?? []),

      proPrice: (json['pro_price'] as num?)?.toDouble() ?? 199.0,
      proTitle: json['pro_title']?.toString() ?? 'Pro / Enterprise Tier',
      proDesc: json['pro_desc']?.toString() ?? 'Premium full suite with priority support',
      proDeliveryDays: (json['pro_delivery_days'] as num?)?.toInt() ?? 7,
      proRevisions: (json['pro_revisions'] as num?)?.toInt() ?? 99,
      proFeatures: List<String>.from(json['pro_features'] ?? []),

      rating: (json['rating'] as num?)?.toDouble() ?? 5.0,
      totalReviews: (json['total_reviews'] as num?)?.toInt() ?? 0,
      totalOrders: (json['total_orders'] as num?)?.toInt() ?? 0,
      isFeatured: json['is_featured'] == true,
      status: json['status']?.toString() ?? 'active',
      createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ?? DateTime.now(),
      creatorProfile: json['profiles'] as Map<String, dynamic>?,
    );
  }
}
