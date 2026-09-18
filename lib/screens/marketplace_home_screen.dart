// lib/screens/marketplace_home_screen.dart
import 'package:flutter/material.dart';
import '../models/gig_model.dart';
import '../services/supabase_service.dart';
import 'gig_detail_screen.dart';

class MarketplaceHomeScreen extends StatefulWidget {
  final bool isGuest;
  const MarketplaceHomeScreen({super.key, this.isGuest = false});

  @override
  State<MarketplaceHomeScreen> createState() => _MarketplaceHomeScreenState();
}

class _MarketplaceHomeScreenState extends State<MarketplaceHomeScreen> {
  String? _selectedCategory;
  String _searchQuery = '';
  String _sortBy = 'rating';
  final TextEditingController _searchController = TextEditingController();

  List<Map<String, dynamic>> _categories = [];
  List<GigModel> _gigs = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final cats = await SkillNexusService.fetchCategories();
      final gigs = await SkillNexusService.fetchGigs(
        categorySlug: _selectedCategory,
        searchQuery: _searchQuery,
        sortBy: _sortBy,
      );

      if (mounted) {
        setState(() {
          _categories = cats;
          _gigs = gigs;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF6366F1), Color(0xFF06B6D4)]),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.bolt, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 8),
            const Text(
              'SkillNexus',
              style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: -0.5),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.chat_bubble_outline),
            onPressed: () {},
          ),
          if (widget.isGuest)
            Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  foregroundColor: Colors.white,
                ),
                onPressed: () {},
                child: const Text('Sign In'),
              ),
            )
          else
            const Padding(
              padding: EdgeInsets.only(right: 16.0),
              child: CircleAvatar(
                radius: 18,
                backgroundImage: NetworkImage('https://api.dicebear.com/7.x/avataaars/svg?seed=SkillNexusUser'),
              ),
            ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: CustomScrollView(
          slivers: [
            // 1. HERO SECTION BANNER
            SliverToBoxAdapter(
              child: Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isDark
                        ? [const Color(0xFF1E1B4B), const Color(0xFF0F172A)]
                        : [const Color(0xFFEEF2FF), const Color(0xFFE0F2FE)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: isDark ? const Color(0xFF4338CA).withValues(alpha: 0.5) : const Color(0xFFC7D2FE),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF6366F1).withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.stars, size: 14, color: Color(0xFF6366F1)),
                          SizedBox(width: 4),
                          Text(
                            'AI-Matched Creator Marketplace',
                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF6366F1)),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Hire Elite Tech & Creative Talent, On-Demand.',
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, height: 1.2),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Book top AI engineers, UI/UX designers, video editors, and 1-on-1 mentors with verified escrow security.',
                      style: TextStyle(color: theme.colorScheme.onSurfaceVariant, fontSize: 14),
                    ),
                    const SizedBox(height: 18),

                    // Search Input Box
                    TextField(
                      controller: _searchController,
                      onChanged: (val) {
                        _searchQuery = val;
                        _loadData();
                      },
                      decoration: InputDecoration(
                        hintText: 'Search gigs, skills, or creators (e.g. Flutter, LLM, Figma)...',
                        prefixIcon: const Icon(Icons.search, color: Color(0xFF6366F1)),
                        filled: true,
                        fillColor: isDark ? const Color(0xFF0B0F19) : Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // 2. POPULAR CATEGORIES HORIZONTAL STREAM
            SliverToBoxAdapter(
              child: SizedBox(
                height: 48,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: _categories.length + 1,
                  itemBuilder: (context, index) {
                    if (index == 0) {
                      final isAll = _selectedCategory == null;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: FilterChip(
                          label: const Text('✨ All Domains'),
                          selected: isAll,
                          onSelected: (_) {
                            setState(() => _selectedCategory = null);
                            _loadData();
                          },
                          backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.grey.shade100,
                          selectedColor: const Color(0xFF6366F1),
                          labelStyle: TextStyle(
                            color: isAll ? Colors.white : theme.colorScheme.onSurface,
                            fontWeight: isAll ? FontWeight.bold : FontWeight.normal,
                          ),
                        ),
                      );
                    }

                    final cat = _categories[index - 1];
                    final isSelected = _selectedCategory == cat['slug'];
                    return Padding(
                      padding: const EdgeInsets.only(right: 8.0),
                      child: FilterChip(
                        avatar: Text(cat['icon'] ?? '⚡'),
                        label: Text(cat['name'] ?? ''),
                        selected: isSelected,
                        onSelected: (_) {
                          setState(() => _selectedCategory = cat['slug']);
                          _loadData();
                        },
                        backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.grey.shade100,
                        selectedColor: const Color(0xFF6366F1),
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : theme.colorScheme.onSurface,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 16)),

            // 3. GIGS GRID SECTION
            if (_isLoading)
              const SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              )
            else if (_gigs.isEmpty)
              SliverFillRemaining(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.work_off_outlined, size: 64, color: Colors.grey),
                      const SizedBox(height: 12),
                      const Text('No gigs found in this category', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('Try changing your search keywords or filter.', style: TextStyle(color: theme.colorScheme.onSurfaceVariant)),
                    ],
                  ),
                ),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                    maxCrossAxisExtent: 380,
                    mainAxisExtent: 390,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final gig = _gigs[index];
                      final creator = gig.creatorProfile;
                      final creatorName = creator?['full_name'] ?? 'Creator';
                      final tier = creator?['creator_tier'] ?? 'Rising Star';
                      final avatar = creator?['avatar_url'] ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=${gig.creatorId}';

                      return Card(
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(
                            color: isDark ? Colors.grey.shade800 : Colors.grey.shade200,
                          ),
                        ),
                        clipBehavior: Clip.antiAlias,
                        child: InkWell(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => GigDetailScreen(gig: gig),
                              ),
                            );
                          },
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Cover Image with Badge
                              Stack(
                                children: [
                                  AspectRatio(
                                    aspectRatio: 16 / 9,
                                    child: Image.network(
                                      gig.coverImage,
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, _, _) => Container(
                                        color: Colors.grey.shade900,
                                        child: const Icon(Icons.image, color: Colors.grey),
                                      ),
                                    ),
                                  ),
                                  Positioned(
                                    top: 10,
                                    right: 10,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: Colors.black.withValues(alpha: 0.7),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Icon(Icons.star, size: 14, color: Colors.amber),
                                          const SizedBox(width: 4),
                                          Text(
                                            gig.rating.toStringAsFixed(1),
                                            style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                                          ),
                                          Text(
                                            ' (${gig.totalReviews})',
                                            style: const TextStyle(color: Colors.white70, fontSize: 11),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),

                              // Creator Avatar & Name
                              Padding(
                                padding: const EdgeInsets.all(12.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 14,
                                          backgroundImage: NetworkImage(avatar),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                creatorName,
                                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                              Text(
                                                tier,
                                                style: const TextStyle(color: Color(0xFF6366F1), fontSize: 11, fontWeight: FontWeight.w600),
                                              ),
                                            ],
                                          ),
                                        ),
                                        const Icon(Icons.verified, size: 16, color: Color(0xFF06B6D4)),
                                      ],
                                    ),
                                    const SizedBox(height: 10),

                                    // Gig Title
                                    Text(
                                      gig.title,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, height: 1.3),
                                    ),
                                    const SizedBox(height: 12),

                                    const Divider(height: 1),
                                    const SizedBox(height: 8),

                                    // Pricing & Delivery
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Row(
                                          children: [
                                            const Icon(Icons.schedule, size: 14, color: Colors.grey),
                                            const SizedBox(width: 4),
                                            Text(
                                              '${gig.starterDeliveryDays}d delivery',
                                              style: TextStyle(fontSize: 12, color: theme.colorScheme.onSurfaceVariant),
                                            ),
                                          ],
                                        ),
                                        Text.rich(
                                          TextSpan(
                                            text: 'From ',
                                            style: TextStyle(fontSize: 11, color: theme.colorScheme.onSurfaceVariant),
                                            children: [
                                              TextSpan(
                                                text: '\$${gig.starterPrice.toStringAsFixed(0)}',
                                                style: const TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.w900,
                                                  color: Color(0xFF10B981),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                    childCount: _gigs.length,
                  ),
                ),
              ),

            const SliverToBoxAdapter(child: SizedBox(height: 40)),
          ],
        ),
      ),
    );
  }
}
