import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/theme.dart';

class SupportScreen extends StatefulWidget {
  const SupportScreen({super.key});

  @override
  State<SupportScreen> createState() => _SupportScreenState();
}

class _SupportScreenState extends State<SupportScreen> {
  String _activeCategory = "all";
  final TextEditingController _searchController = TextEditingController();

  final List<Map<String, dynamic>> _contactMethods = [
    {
      "title": "Call Us",
      "description": "Speak directly with our team",
      "icon": Icons.phone_rounded,
      "action": "tel:+9718007378423",
      "actionLabel": "Call Now",
      "available": "Available 24/7",
      "color": Colors.green,
    },
    {
      "title": "Email Support",
      "description": "Get a response within 24h",
      "icon": Icons.email_rounded,
      "action": "mailto:support@serviceapp.ae",
      "actionLabel": "Send Email",
      "available": "Response within 24h",
      "color": Colors.blue,
    },
    {
      "title": "Live Chat",
      "description": "Chat with our agents",
      "icon": Icons.chat_bubble_rounded,
      "action": "https://wa.me/971500000000", // WhatsApp link example
      "actionLabel": "Start Chat",
      "available": "8 AM - 10 PM",
      "color": Colors.purple,
    },
  ];

  final List<Map<String, String>> _faqs = [
    {
      "category": "Booking",
      "question": "How do I book a service?",
      "answer":
          "Booking a service is easy! Simply click the 'Book a Service' button on the homepage, select your desired service type, choose a convenient date and time slot, and provide your address details."
    },
    {
      "category": "Booking",
      "question": "Can I reschedule or cancel?",
      "answer":
          "Yes, you can reschedule or cancel your booking up to 24 hours before the scheduled time without any charges via the 'My Requests' page."
    },
    {
      "category": "Payment",
      "question": "What payment methods do you accept?",
      "answer":
          "We accept all major credit/debit cards, Apple Pay, Google Pay, and cash on completion."
    },
    {
      "category": "Services",
      "question": "Do you provide warranties?",
      "answer":
          "Yes! All our services come with a 90-day warranty on workmanship."
    },
  ];

  List<Map<String, String>> get _filteredFaqs {
    return _faqs.where((faq) {
      final matchesCategory =
          _activeCategory == "all" || faq["category"] == _activeCategory;
      final matchesSearch = _searchController.text.isEmpty ||
          faq["question"]!
              .toLowerCase()
              .contains(_searchController.text.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();
  }

  Future<void> _launchUrl(String urlString) async {
    final Uri url = Uri.parse(urlString);
    if (!await launchUrl(url)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not launch $urlString')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text("Support & Help"),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppTheme.primary.withOpacity(0.1),
                    Colors.teal.withOpacity(0.05),
                  ],
                ),
              ),
              child: Column(
                children: [
                  const Text(
                    "How can we help you?",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "Find answers to common questions or get in touch with our support team.",
                    textAlign: TextAlign.center,
                    style: TextStyle(color: AppTheme.textSecondary),
                  ),
                  const SizedBox(height: 24),
                  TextField(
                    controller: _searchController,
                    onChanged: (_) => setState(() {}),
                    decoration: InputDecoration(
                      hintText: "Search for topics...",
                      prefixIcon: const Icon(Icons.search_rounded),
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 16),
                    ),
                  ),
                ],
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Contact Methods
                  const Text(
                    "Get in Touch",
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary),
                  ),
                  const SizedBox(height: 16),
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _contactMethods.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final method = _contactMethods[index];
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
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color:
                                    (method['color'] as Color).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child:
                                  Icon(method['icon'], color: method['color']),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    method['title'],
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16),
                                  ),
                                  Text(
                                    method['description'],
                                    style: const TextStyle(
                                        fontSize: 12,
                                        color: AppTheme.textSecondary),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    method['available'],
                                    style: const TextStyle(
                                        fontSize: 10, color: Colors.grey),
                                  ),
                                ],
                              ),
                            ),
                            ElevatedButton(
                              onPressed: () => _launchUrl(method['action']),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.black,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 8),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8)),
                              ),
                              child: Text(method['actionLabel']),
                            ),
                          ],
                        ),
                      ).animate().fadeIn(delay: (index * 100).ms).slideX();
                    },
                  ),

                  const SizedBox(height: 32),

                  // FAQs
                  const Text(
                    "Frequently Asked Questions",
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary),
                  ),
                  const SizedBox(height: 16),

                  // Categories
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children:
                          ["all", "Booking", "Payment", "Services"].map((cat) {
                        final isSelected = _activeCategory == cat;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ChoiceChip(
                            label: Text(cat == "all" ? "All Topics" : cat),
                            selected: isSelected,
                            onSelected: (_) =>
                                setState(() => _activeCategory = cat),
                            selectedColor: AppTheme.primary,
                            labelStyle: TextStyle(
                                color: isSelected
                                    ? Colors.white
                                    : AppTheme.textSecondary),
                            backgroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                              side: BorderSide(
                                  color: isSelected
                                      ? Colors.transparent
                                      : AppTheme.border),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),

                  const SizedBox(height: 16),

                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _filteredFaqs.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final faq = _filteredFaqs[index];
                      return Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppTheme.border),
                        ),
                        child: Theme(
                          data: Theme.of(context)
                              .copyWith(dividerColor: Colors.transparent),
                          child: ExpansionTile(
                            title: Text(
                              faq['question']!,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w600, fontSize: 14),
                            ),
                            leading: Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: AppTheme.background,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(Icons.help_outline_rounded,
                                  size: 16, color: AppTheme.textSecondary),
                            ),
                            childrenPadding:
                                const EdgeInsets.fromLTRB(16, 0, 16, 16),
                            children: [
                              Text(
                                faq['answer']!,
                                style: const TextStyle(
                                    fontSize: 13,
                                    color: AppTheme.textSecondary,
                                    height: 1.5),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
