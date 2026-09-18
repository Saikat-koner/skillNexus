// lib/screens/gig_detail_screen.dart
import 'package:flutter/material.dart';
import '../models/gig_model.dart';
import '../services/supabase_service.dart';

class GigDetailScreen extends StatefulWidget {
  final GigModel gig;
  const GigDetailScreen({super.key, required this.gig});

  @override
  State<GigDetailScreen> createState() => _GigDetailScreenState();
}

class _GigDetailScreenState extends State<GigDetailScreen> with SingleTickerProviderStateMixin {
  late TabController _tierTabController;
  int _selectedTierIndex = 0; // 0: Starter, 1: Standard, 2: Pro
  bool _isOrdering = false;

  @override
  void initState() {
    super.initState();
    _tierTabController = TabController(length: 3, vsync: this);
    _tierTabController.addListener(() {
      if (_tierTabController.indexIsChanging) {
        setState(() => _selectedTierIndex = _tierTabController.index);
      }
    });
  }

  @override
  void dispose() {
    _tierTabController.dispose();
    super.dispose();
  }

  void _showOrderEscrowModal() {
    final gig = widget.gig;
    final tiers = [
      {
        'key': 'starter',
        'title': gig.starterTitle,
        'price': gig.starterPrice,
        'days': gig.starterDeliveryDays,
        'desc': gig.starterDesc,
      },
      {
        'key': 'standard',
        'title': gig.standardTitle,
        'price': gig.standardPrice,
        'days': gig.standardDeliveryDays,
        'desc': gig.standardDesc,
      },
      {
        'key': 'pro',
        'title': gig.proTitle,
        'price': gig.proPrice,
        'days': gig.proDeliveryDays,
        'desc': gig.proDesc,
      },
    ];

    final currentTier = tiers[_selectedTierIndex];
    final reqController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              left: 24,
              right: 24,
              top: 24,
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 48,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.shield_outlined, color: Color(0xFF10B981), size: 24),
                      ),
                      const SizedBox(width: 12),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Secure Escrow Checkout', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                          Text('Funds held securely until project delivery is approved', style: TextStyle(fontSize: 12, color: Colors.grey)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Selected Tier Summary Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6366F1).withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFF6366F1).withValues(alpha: 0.2)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              currentTier['title'] as String,
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            Text(
                              '⚡ ${currentTier['days']} Business Days Delivery',
                              style: const TextStyle(color: Colors.grey, fontSize: 13),
                            ),
                          ],
                        ),
                        Text(
                          '\$${(currentTier['price'] as double).toStringAsFixed(0)}',
                          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF10B981)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  const Text(
                    'Client Project Requirements',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: reqController,
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText: 'Describe your vision, specific assets, tech stack, API keys, or design Figma links...',
                      filled: true,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF6366F1),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: _isOrdering
                          ? null
                          : () async {
                              if (reqController.text.trim().isEmpty) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Please enter your project requirements')),
                                );
                                return;
                              }

                              setModalState(() => _isOrdering = true);
                              try {
                                await SkillNexusService.createOrder(
                                  gigId: gig.id,
                                  sellerId: gig.creatorId,
                                  tierSelected: currentTier['key'] as String,
                                  packageTitle: currentTier['title'] as String,
                                  amount: currentTier['price'] as double,
                                  deliveryDays: currentTier['days'] as int,
                                  requirements: reqController.text.trim(),
                                );

                                if (mounted) {
                                  Navigator.pop(ctx);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      backgroundColor: Color(0xFF10B981),
                                      content: Text('🎉 Escrow Order Placed Successfully! Creator notified.'),
                                    ),
                                  );
                                }
                              } catch (e) {
                                if (mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Order Error: ${e.toString()}')),
                                  );
                                }
                              } finally {
                                setModalState(() => _isOrdering = false);
                              }
                            },
                      child: _isOrdering
                          ? const CircularProgressIndicator(color: Colors.white)
                          : Text(
                              'Deposit \$${(currentTier['price'] as double).toStringAsFixed(0)} to Escrow & Start',
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void _showConsultationModal() {
    final gig = widget.gig;
    final topicController = TextEditingController();
    DateTime selectedDate = DateTime.now().add(const Duration(days: 1));
    int selectedMinutes = 30;
    double price = 49.0;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              left: 24,
              right: 24,
              top: 24,
            ),
            child: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 48,
                      height: 5,
                      decoration: BoxDecoration(
                        color: Colors.grey.withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF06B6D4).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(Icons.video_camera_front, color: Color(0xFF06B6D4), size: 24),
                      ),
                      const SizedBox(width: 12),
                      const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Book 1-on-1 Video Mentorship', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
                          Text('Direct video consultation with live code/design review', style: TextStyle(fontSize: 12, color: Colors.grey)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Session Duration Selector
                  const Text('Select Call Duration:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 8),
                  Row(
                    children: [15, 30, 45, 60].map((mins) {
                      final isSelected = selectedMinutes == mins;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text('$mins Min'),
                          selected: isSelected,
                          selectedColor: const Color(0xFF06B6D4),
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : Theme.of(context).colorScheme.onSurface,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                          ),
                          onSelected: (_) {
                            setModalState(() {
                              selectedMinutes = mins;
                              price = mins == 15
                                  ? 29.0
                                  : mins == 30
                                      ? 49.0
                                      : mins == 45
                                          ? 69.0
                                          : 89.0;
                            });
                          },
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  const Text('Session Agenda / Topic:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 8),
                  TextField(
                    controller: topicController,
                    decoration: InputDecoration(
                      hintText: 'e.g. Flutter Architecture Review, Figma System teardown...',
                      filled: true,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF06B6D4),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: () async {
                        try {
                          await SkillNexusService.bookConsultation(
                            creatorId: gig.creatorId,
                            topic: topicController.text.trim().isEmpty ? 'General Mentorship' : topicController.text.trim(),
                            details: 'Scheduled via SkillNexus 1-on-1 Consultation System',
                            scheduledAt: selectedDate,
                            durationMinutes: selectedMinutes,
                            price: price,
                          );

                          if (mounted) {
                            Navigator.pop(ctx);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                backgroundColor: Color(0xFF10B981),
                                content: Text('🎉 Consultation Booked! Google Meet link generated.'),
                              ),
                            );
                          }
                        } catch (e) {
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Booking Error: ${e.toString()}')),
                            );
                          }
                        }
                      },
                      child: Text(
                        'Confirm & Book Call (\$$price)',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final gig = widget.gig;
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final creator = gig.creatorProfile;
    final creatorName = creator?['full_name'] ?? 'Verified Creator';
    final tier = creator?['creator_tier'] ?? 'Rising Star';
    final avatar = creator?['avatar_url'] ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=${gig.creatorId}';

    return Scaffold(
      appBar: AppBar(
        title: Text(
          gig.title,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.bookmark_border),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cover Image & Gallery
            ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: AspectRatio(
                aspectRatio: 16 / 9,
                child: Image.network(
                  gig.coverImage,
                  fit: BoxFit.cover,
                  errorBuilder: (_, _, _) => Container(
                    color: Colors.grey.shade900,
                    child: const Icon(Icons.image, size: 48, color: Colors.grey),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Creator Header Bar
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.grey.shade100,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 24,
                    backgroundImage: NetworkImage(avatar),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(creatorName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                            const SizedBox(width: 6),
                            const Icon(Icons.verified, size: 18, color: Color(0xFF06B6D4)),
                          ],
                        ),
                        Text(
                          tier,
                          style: const TextStyle(color: Color(0xFF6366F1), fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF06B6D4),
                      side: const BorderSide(color: Color(0xFF06B6D4)),
                    ),
                    onPressed: _showConsultationModal,
                    icon: const Icon(Icons.video_call, size: 18),
                    label: const Text('1-on-1 Call'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Title
            Text(
              gig.title,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, height: 1.3),
            ),
            const SizedBox(height: 12),

            // Rating & Stats Ticker
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.amber.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.star, size: 16, color: Colors.amber),
                      const SizedBox(width: 4),
                      Text(
                        gig.rating.toStringAsFixed(1),
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Text('(${gig.totalReviews} verified reviews)', style: const TextStyle(color: Colors.grey, fontSize: 13)),
                const Spacer(),
                Text('⚡ ${gig.totalOrders} Orders Completed', style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 13)),
              ],
            ),
            const SizedBox(height: 24),

            // 3-TIER PRICING PACKAGES CARD
            Container(
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E293B) : Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: isDark ? Colors.grey.shade800 : Colors.grey.shade300),
              ),
              child: Column(
                children: [
                  TabBar(
                    controller: _tierTabController,
                    indicatorColor: const Color(0xFF6366F1),
                    labelColor: const Color(0xFF6366F1),
                    unselectedLabelColor: Colors.grey,
                    tabs: const [
                      Tab(text: 'Starter'),
                      Tab(text: 'Standard'),
                      Tab(text: 'Pro VIP'),
                    ],
                  ),
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: _buildTierContent(_selectedTierIndex),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Gig Description
            const Text('About This Gig', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(
              gig.description,
              style: TextStyle(color: theme.colorScheme.onSurfaceVariant, fontSize: 15, height: 1.5),
            ),
            const SizedBox(height: 24),

            // Skill Tags
            const Text('Skills & Deliverables', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: gig.tags
                  .map((tag) => Chip(
                        label: Text(tag),
                        backgroundColor: const Color(0xFF6366F1).withValues(alpha: 0.1),
                        labelStyle: const TextStyle(color: Color(0xFF6366F1), fontWeight: FontWeight.w600, fontSize: 12),
                      ))
                  .toList(),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: theme.scaffoldBackgroundColor,
          border: Border(top: BorderSide(color: isDark ? Colors.grey.shade800 : Colors.grey.shade200)),
        ),
        child: Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: _showOrderEscrowModal,
                icon: const Icon(Icons.flash_on),
                label: Text(
                  'Order Package (\$$currentTierPrice)',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  double get currentTierPrice {
    if (_selectedTierIndex == 1) return widget.gig.standardPrice;
    if (_selectedTierIndex == 2) return widget.gig.proPrice;
    return widget.gig.starterPrice;
  }

  Widget _buildTierContent(int index) {
    final gig = widget.gig;
    final title = index == 0 ? gig.starterTitle : index == 1 ? gig.standardTitle : gig.proTitle;
    final price = index == 0 ? gig.starterPrice : index == 1 ? gig.standardPrice : gig.proPrice;
    final desc = index == 0 ? gig.starterDesc : index == 1 ? gig.standardDesc : gig.proDesc;
    final days = index == 0 ? gig.starterDeliveryDays : index == 1 ? gig.standardDeliveryDays : gig.proDeliveryDays;
    final revisions = index == 0 ? gig.starterRevisions : index == 1 ? gig.standardRevisions : gig.proRevisions;
    final features = index == 0 ? gig.starterFeatures : index == 1 ? gig.standardFeatures : gig.proFeatures;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text('\$${price.toStringAsFixed(0)}', style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Color(0xFF10B981))),
          ],
        ),
        const SizedBox(height: 8),
        Text(desc, style: const TextStyle(color: Colors.grey, fontSize: 14)),
        const SizedBox(height: 16),

        Row(
          children: [
            const Icon(Icons.schedule, size: 16, color: Colors.grey),
            const SizedBox(width: 6),
            Text('$days Days Delivery', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(width: 16),
            const Icon(Icons.sync, size: 16, color: Colors.grey),
            const SizedBox(width: 6),
            Text(revisions >= 99 ? 'Unlimited Revisions' : '$revisions Revisions', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          ],
        ),
        const SizedBox(height: 16),
        const Divider(),
        const SizedBox(height: 8),

        ...features.map((feat) => Padding(
              padding: const EdgeInsets.only(bottom: 8.0),
              child: Row(
                children: [
                  const Icon(Icons.check_circle, size: 18, color: Color(0xFF10B981)),
                  const SizedBox(width: 8),
                  Expanded(child: Text(feat, style: const TextStyle(fontSize: 14))),
                ],
              ),
            )),
      ],
    );
  }
}
