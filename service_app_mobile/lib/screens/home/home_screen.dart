import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../services/firestore_service.dart';
import '../../models/request_model.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      backgroundColor: AppTheme.background,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          await FirebaseAnalytics.instance.logEvent(
            name: 'test_analytics_event',
            parameters: {'source': 'test_button'},
          );
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                  content: Text('Firebase Event Sent: test_analytics_event')),
            );
          }
        },
        label: const Text('Test Analytics'),
        icon: const Icon(Icons.analytics_rounded),
        backgroundColor: AppTheme.primary,
        foregroundColor: Colors.white,
      ),
      drawer: Drawer(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(0),
            bottomRight: Radius.circular(0),
          ),
        ),
        child: Column(
          children: [
            const SizedBox(height: 60),
            // Navigation Links
            ListTile(
              leading:
                  const Icon(Icons.home_rounded, color: AppTheme.textSecondary),
              title: const Text("Home",
                  style: TextStyle(fontWeight: FontWeight.w500)),
              onTap: () {
                context.pop(); // Close drawer
              },
            ),
            ListTile(
              leading: const Icon(Icons.calendar_month_rounded,
                  color: AppTheme.textSecondary),
              title: const Text("My Requests",
                  style: TextStyle(fontWeight: FontWeight.w500)),
              onTap: () {
                context.pop();
                context.push('/requests');
              },
            ),
            ListTile(
              leading: const Icon(Icons.help_outline_rounded,
                  color: AppTheme.textSecondary),
              title: const Text("Support",
                  style: TextStyle(fontWeight: FontWeight.w500)),
              onTap: () {
                context.pop();
                context.push('/support');
              },
            ),
            const Spacer(),
            // Profile Section
            Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: AppTheme.border)),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: AppTheme.background,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppTheme.border),
                        ),
                        child: Center(
                          child: Text(
                            user?.phoneNumber?.substring(0, 2) ?? "U",
                            style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: AppTheme.textPrimary),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              user?.phoneNumber ?? "User",
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            const Text(
                              "Standard Plan",
                              style: TextStyle(
                                  fontSize: 12, color: AppTheme.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton.icon(
                      onPressed: () {
                        authProvider.signOut();
                        context.go('/login');
                      },
                      icon: const Icon(Icons.logout_rounded, size: 18),
                      label: const Text("Sign Out"),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.red,
                        side: BorderSide(color: Colors.red.withOpacity(0.2)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.only(top: 80),
            child: Column(
              children: [
                const _HeroSection(),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 24),
                      // Action Cards Grid
                      LayoutBuilder(
                        builder: (context, constraints) {
                          // Responsive grid: 1 column on mobile, 3 on tablet/desktop
                          int crossAxisCount =
                              constraints.maxWidth > 600 ? 3 : 1;
                          return GridView.count(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            crossAxisCount: crossAxisCount,
                            mainAxisSpacing: 16,
                            crossAxisSpacing: 16,
                            childAspectRatio: crossAxisCount == 1 ? 1.4 : 1.0,
                            children: [
                              _ActionCard(
                                title: "Book a Service",
                                description:
                                    "Schedule a new maintenance visit or repair.",
                                icon: Icons.calendar_month_rounded,
                                actionText: "Book Now",
                                onTap: () => context.push('/book'),
                              ),
                              _ActionCard(
                                title: "Track Request",
                                description:
                                    "Check status of your ongoing requests.",
                                icon: Icons.search_rounded,
                                actionText: "View Status",
                                onTap: () => context.push('/requests'),
                              ),
                              _ActionCard(
                                title: "Support & Help",
                                description:
                                    "Contact support for quick resolutions.",
                                icon: Icons.help_outline_rounded,
                                actionText: "Get Help",
                                onTap: () => context.push('/support'),
                              ),
                            ],
                          );
                        },
                      ),
                      const SizedBox(height: 48),
                      const _RecentActivitySection(),
                      const SizedBox(height: 48),
                      const _ServiceHighlights(),
                      const SizedBox(height: 48),
                      const _TrustSection(),
                      const SizedBox(height: 48),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: _Navbar(),
          ),
        ],
      ),
    );
  }
}

class _Navbar extends StatelessWidget {
  const _Navbar();

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.8),
            border: const Border(bottom: BorderSide(color: AppTheme.border)),
          ),
          child: SafeArea(
            bottom: false,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.handyman_rounded,
                          color: AppTheme.primary, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      "ServiceApp",
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textPrimary,
                          ),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.menu_rounded,
                      color: AppTheme.textSecondary),
                  onPressed: () {
                    Scaffold.of(context).openDrawer();
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _HeroSection extends StatelessWidget {
  const _HeroSection();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 48, 16, 48),
      decoration: const BoxDecoration(
        color: Colors.white,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.primary.withOpacity(0.2)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.bolt_rounded,
                    size: 16, color: AppTheme.primary),
                const SizedBox(width: 6),
                const Text(
                  "#1 Home Services Platform",
                  style: TextStyle(
                    color: AppTheme.primary,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 600.ms).slideY(begin: 0.2, end: 0),

          const SizedBox(height: 24),

          // Heading
          RichText(
            text: TextSpan(
              style: Theme.of(context).textTheme.displayMedium?.copyWith(
                    height: 1.2,
                    letterSpacing: -0.5,
                  ),
              children: [
                const TextSpan(text: "Premium Home Services\n"),
                WidgetSpan(
                  child: ShaderMask(
                    shaderCallback: (bounds) => const LinearGradient(
                      colors: [AppTheme.primary, Color(0xFF8B5CF6)], // Violet
                    ).createShader(bounds),
                    child: Text(
                      "At Your Fingertips",
                      style:
                          Theme.of(context).textTheme.displayMedium?.copyWith(
                                height: 1.2,
                                color: Colors.white, // Required for ShaderMask
                                fontWeight: FontWeight.bold,
                              ),
                    ),
                  ),
                ),
              ],
            ),
          )
              .animate()
              .fadeIn(delay: 200.ms, duration: 600.ms)
              .slideX(begin: -0.1, end: 0),

          const SizedBox(height: 16),

          Text(
            "Connect with verified professionals for all your home maintenance needs. Fast, reliable, and backed by our satisfaction guarantee.",
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: AppTheme.textSecondary,
                  height: 1.5,
                ),
          ).animate().fadeIn(delay: 400.ms, duration: 600.ms),

          const SizedBox(height: 32),

          // Stats
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const _StatItem(value: "50K+", label: "Happy Customers"),
              const _StatItem(
                  value: "4.9", label: "Rating", icon: Icons.star_rounded),
              const _StatItem(value: "24/7", label: "Support"),
            ],
          )
              .animate()
              .fadeIn(delay: 600.ms, duration: 600.ms)
              .slideY(begin: 0.2, end: 0),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  final IconData? icon;

  const _StatItem({required this.value, required this.label, this.icon});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Text(
              value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            if (icon != null) ...[
              const SizedBox(width: 4),
              Icon(icon, size: 18, color: Colors.amber),
            ],
          ],
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: AppTheme.textSecondary,
          ),
        ),
      ],
    );
  }
}

class _ActionCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final String actionText;
  final VoidCallback onTap;

  const _ActionCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.actionText,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.border),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.background,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: AppTheme.textPrimary, size: 24),
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppTheme.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              description,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 13,
                color: AppTheme.textSecondary,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Text(
                  actionText,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.primary,
                  ),
                ),
                const SizedBox(width: 4),
                const Icon(Icons.arrow_forward_rounded,
                    size: 16, color: AppTheme.primary),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _RecentActivitySection extends StatelessWidget {
  const _RecentActivitySection();

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).user;

    if (user == null) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              "Recent Activity",
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
            ),
            TextButton(
              onPressed: () => context.push('/requests'),
              child: const Text("View All"),
            ),
          ],
        ),
        const SizedBox(height: 16),
        StreamBuilder<List<RequestModel>>(
          stream: FirestoreService().getRecentRequests(user.uid),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Container(
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.border),
                ),
                child: const Center(child: CircularProgressIndicator()),
              );
            }

            final requests = snapshot.data ?? [];

            if (requests.isEmpty) {
              return Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.border),
                ),
                child: Center(
                  child: Column(
                    children: [
                      Icon(Icons.history_rounded,
                          size: 48,
                          color: AppTheme.textSecondary.withOpacity(0.5)),
                      const SizedBox(height: 16),
                      const Text(
                        "No recent activity",
                        style: TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }

            return ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: requests.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final request = requests[index];
                return _ActivityItem(request: request);
              },
            );
          },
        ),
      ],
    );
  }
}

class _ActivityItem extends StatelessWidget {
  final RequestModel request;

  const _ActivityItem({required this.request});

  @override
  Widget build(BuildContext context) {
    Color statusColor;
    switch (request.status) {
      case 'pending':
        statusColor = Colors.amber;
        break;
      case 'completed':
        statusColor = Colors.green;
        break;
      case 'inProgress':
        statusColor = AppTheme.primary;
        break;
      default:
        statusColor = Colors.blue;
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.border),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              _getServiceIcon(request.serviceId),
              color: statusColor,
              size: 20,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  request.serviceName,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 14),
                ),
                const SizedBox(height: 2),
                Text(
                  DateFormat('MMM d, h:mm a').format(request.createdAt),
                  style: const TextStyle(
                      fontSize: 12, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              request.status.toUpperCase(),
              style: TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.bold,
                color: statusColor,
              ),
            ),
          ),
        ],
      ),
    );
  }

  IconData _getServiceIcon(String id) {
    if (id.contains('ac')) return Icons.air_rounded;
    if (id.contains('plumb')) return Icons.water_drop_rounded;
    if (id.contains('elect')) return Icons.bolt_rounded;
    return Icons.build_rounded;
  }
}

class _ServiceHighlights extends StatelessWidget {
  const _ServiceHighlights();

  @override
  Widget build(BuildContext context) {
    final highlights = [
      {
        'icon': Icons.access_time_rounded,
        'title': "Instant Booking",
        'description': "Verified professionals ready to help.",
      },
      {
        'icon': Icons.verified_user_rounded,
        'title': "Vetted Experts",
        'description': "Strict background checks & skills verification.",
      },
      {
        'icon': Icons.sync_rounded,
        'title': "Live Tracking",
        'description': "Real-time updates status at every step.",
      },
      {
        'icon': Icons.security_rounded,
        'title': "Bank-Grade Security",
        'description': "Your data is protected by latest encryption.",
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Why Choose Us?",
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 0.7,
          ),
          itemCount: highlights.length,
          itemBuilder: (context, index) {
            final item = highlights[index];
            return Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppTheme.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(item['icon'] as IconData,
                        color: AppTheme.primary, size: 20),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    item['title'] as String,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item['description'] as String,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.textSecondary,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            )
                .animate()
                .fadeIn(delay: (index * 100).ms)
                .slideY(begin: 0.2, end: 0);
          },
        ),
      ],
    );
  }
}

class _TrustSection extends StatelessWidget {
  const _TrustSection();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppTheme.background,
        border:
            Border.symmetric(horizontal: BorderSide(color: AppTheme.border)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.monitor_rounded, color: Colors.grey),
              const SizedBox(width: 8),
              Container(
                  width: 4,
                  height: 4,
                  decoration: const BoxDecoration(
                      color: Colors.grey, shape: BoxShape.circle)),
              const SizedBox(width: 8),
              const Icon(Icons.smartphone_rounded, color: Colors.grey),
            ],
          ),
          const SizedBox(height: 12),
          const Text(
            "Seamless Cross-Platform Experience",
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            "Your account and requests are instantly synced across all your devices.",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 12,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
