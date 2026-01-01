import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../models/request_model.dart';
import '../../services/firestore_service.dart';
import '../../providers/auth_provider.dart';

class RequestsScreen extends StatefulWidget {
  const RequestsScreen({super.key});

  @override
  State<RequestsScreen> createState() => _RequestsScreenState();
}

class _RequestsScreenState extends State<RequestsScreen> {
  String _activeFilter = "all"; // all, active, completed

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    if (user == null) {
      return const Scaffold(
        body: Center(child: Text("Please login to view requests")),
      );
    }

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text("My Requests"),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_rounded),
            onPressed: () => context.push('/book'),
          ),
        ],
      ),
      body: StreamBuilder<List<RequestModel>>(
        stream: FirestoreService().getUserRequests(user.uid),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }

          final requests = snapshot.data ?? [];

          // Calculate counts
          final activeCount = requests
              .where((r) =>
                  r.status == 'pending' ||
                  r.status == 'confirmed' ||
                  r.status == 'inProgress')
              .length;
          final completedCount =
              requests.where((r) => r.status == 'completed').length;

          // Filter requests
          final filteredRequests = requests.where((r) {
            if (_activeFilter == 'active') {
              return r.status == 'pending' ||
                  r.status == 'confirmed' ||
                  r.status == 'inProgress';
            }
            if (_activeFilter == 'completed') {
              return r.status == 'completed';
            }
            return true;
          }).toList();

          return Column(
            children: [
              // Stats
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    _buildStatCard("Total", requests.length,
                        Colors.grey.shade100, AppTheme.textPrimary),
                    const SizedBox(width: 12),
                    _buildStatCard("Active", activeCount, AppTheme.secondary,
                        AppTheme.primary),
                    const SizedBox(width: 12),
                    _buildStatCard("Completed", completedCount,
                        Colors.green.shade50, Colors.green.shade700),
                  ],
                ),
              ),

              // Filters
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: ["all", "active", "completed"].map((filter) {
                    final isActive = _activeFilter == filter;
                    // Get count for filter
                    int count = requests.length;
                    if (filter == 'active') count = activeCount;
                    if (filter == 'completed') count = completedCount;

                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(
                          "${filter[0].toUpperCase()}${filter.substring(1)} ($count)",
                          style: TextStyle(
                            color: isActive
                                ? Colors.white
                                : AppTheme.textSecondary,
                            fontWeight:
                                isActive ? FontWeight.w600 : FontWeight.normal,
                          ),
                        ),
                        selected: isActive,
                        onSelected: (_) =>
                            setState(() => _activeFilter = filter),
                        backgroundColor: Colors.white,
                        selectedColor: AppTheme.textPrimary,
                        checkmarkColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(
                            color:
                                isActive ? Colors.transparent : AppTheme.border,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),

              const SizedBox(height: 16),

              // List
              Expanded(
                child: filteredRequests.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.assignment_outlined,
                                size: 64, color: Colors.grey.shade300),
                            const SizedBox(height: 16),
                            Text("No requests found",
                                style: TextStyle(color: Colors.grey.shade500)),
                          ],
                        ),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: filteredRequests.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 16),
                        itemBuilder: (context, index) {
                          return _RequestCard(
                              request: filteredRequests[index], index: index);
                        },
                      ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildStatCard(String label, int value, Color bg, Color text) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              value.toString(),
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: text,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: text.withOpacity(0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RequestCard extends StatelessWidget {
  final RequestModel request;
  final int index;

  const _RequestCard({required this.request, required this.index});

  Color get _statusColor {
    switch (request.status) {
      case 'pending':
        return Colors.amber;
      case 'confirmed':
        return Colors.blue;
      case 'inProgress':
        return AppTheme.primary;
      case 'completed':
        return Colors.green;
      case 'cancelled':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  String get _statusLabel {
    switch (request.status) {
      case 'pending':
        return "Pending";
      case 'confirmed':
        return "Confirmed";
      case 'inProgress':
        return "In Progress";
      case 'completed':
        return "Completed";
      case 'cancelled':
        return "Cancelled";
      default:
        return request.status;
    }
  }

  IconData get _serviceIcon {
    // Map service ID to icon
    if (request.serviceId.contains('ac')) return Icons.air_rounded;
    if (request.serviceId.contains('plumbing')) return Icons.water_drop_rounded;
    if (request.serviceId.contains('electrical')) return Icons.bolt_rounded;
    if (request.serviceId.contains('heating'))
      return Icons.local_fire_department_rounded;
    if (request.serviceId.contains('painting'))
      return Icons.format_paint_rounded;
    return Icons.build_rounded;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: request.status == 'inProgress'
              ? AppTheme.primary.withOpacity(0.3)
              : AppTheme.border,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Status Bar
          Container(
            height: 4,
            decoration: BoxDecoration(
              color: _statusColor,
              borderRadius:
                  const BorderRadius.vertical(top: Radius.circular(16)),
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: _statusColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(_serviceIcon, color: _statusColor, size: 24),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            request.serviceName,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            "REQ-${request.id.substring(0, min(8, request.id.length)).toUpperCase()}",
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppTheme.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: _statusColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(20),
                        border:
                            Border.all(color: _statusColor.withOpacity(0.2)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            request.status == 'completed'
                                ? Icons.check_circle
                                : Icons.access_time_rounded,
                            size: 12,
                            color: _statusColor,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _statusLabel,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: _statusColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Details Grid
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          const Icon(Icons.calendar_today_rounded,
                              size: 14, color: AppTheme.textSecondary),
                          const SizedBox(width: 4),
                          Text(
                            DateFormat('EEE, MMM d').format(request.date),
                            style: const TextStyle(
                                fontSize: 12, color: AppTheme.textSecondary),
                          ),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Row(
                        children: [
                          const Icon(Icons.access_time_rounded,
                              size: 14, color: AppTheme.textSecondary),
                          const SizedBox(width: 4),
                          Text(
                            request.timeSlot,
                            style: const TextStyle(
                                fontSize: 12, color: AppTheme.textSecondary),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(Icons.location_on_rounded,
                        size: 14, color: AppTheme.textSecondary),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        request.address,
                        style: const TextStyle(
                            fontSize: 12, color: AppTheme.textSecondary),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(delay: (index * 100).ms).slideY(begin: 0.2, end: 0);
  }

  int min(int a, int b) => a < b ? a : b;
}
