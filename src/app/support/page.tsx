"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Phone,
    Mail,
    MessageCircle,
    ChevronDown,
    ChevronRight,
    Search,
    HelpCircle,
    FileText,
    Headphones,
    Clock,
    CheckCircle2,
    AlertCircle,
    Send,
    BookOpen,
    Settings,
    CreditCard,
    Calendar,
    Shield,
    Zap,
    ExternalLink,
    ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────────────────────
// Types & Data
// ─────────────────────────────────────────────────────────────
interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

interface SupportTicket {
    id: string;
    subject: string;
    status: "open" | "in-progress" | "resolved";
    lastUpdate: string;
    priority: "low" | "medium" | "high";
}

const faqData: FAQItem[] = [
    {
        id: "1",
        category: "Booking",
        question: "How do I book a service?",
        answer:
            "Booking a service is easy! Simply click the 'Book a Service' button on the homepage, select your desired service type, choose a convenient date and time slot, and provide your address details. You'll receive an instant confirmation via SMS and email.",
    },
    {
        id: "2",
        category: "Booking",
        question: "Can I reschedule or cancel my booking?",
        answer:
            "Yes, you can reschedule or cancel your booking up to 24 hours before the scheduled time without any charges. Go to 'My Requests', find your booking, and click on the options menu to reschedule or cancel. Cancellations within 24 hours may incur a fee.",
    },
    {
        id: "3",
        category: "Booking",
        question: "How far in advance can I book a service?",
        answer:
            "You can book services up to 30 days in advance. For recurring maintenance, we offer subscription plans that automatically schedule your services. Same-day bookings are available for emergency services, subject to technician availability.",
    },
    {
        id: "4",
        category: "Payment",
        question: "What payment methods do you accept?",
        answer:
            "We accept all major credit/debit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and cash on completion. Corporate clients can also opt for monthly invoicing with NET-30 terms.",
    },
    {
        id: "5",
        category: "Payment",
        question: "When am I charged for the service?",
        answer:
            "For standard bookings, your card is authorized at booking but only charged after service completion. You'll receive a detailed invoice via email with the final amount, including any additional parts or services rendered.",
    },
    {
        id: "6",
        category: "Services",
        question: "What services do you offer?",
        answer:
            "We offer comprehensive home maintenance services including AC maintenance and repair, plumbing, electrical work, heating systems, appliance repair, painting, carpentry, and general handyman services. All our technicians are certified and background-checked.",
    },
    {
        id: "7",
        category: "Services",
        question: "Do you provide warranties on your work?",
        answer:
            "Yes! All our services come with a 90-day warranty on workmanship. Parts installed by our technicians carry the manufacturer's warranty, which we help facilitate if issues arise. Our Premium members receive extended 1-year warranties.",
    },
    {
        id: "8",
        category: "Account",
        question: "How do I update my contact information?",
        answer:
            "You can update your profile information, including phone number, email, and saved addresses, from the Account Settings page. Click on your profile icon in the navbar, select 'Settings', and navigate to 'Profile Information'.",
    },
    {
        id: "9",
        category: "Account",
        question: "I forgot my password. How can I reset it?",
        answer:
            "Click 'Sign In', then select 'Forgot Password'. Enter your registered phone number or email, and we'll send you a secure OTP to verify your identity. Once verified, you can set a new password immediately.",
    },
    {
        id: "10",
        category: "Safety",
        question: "How do you ensure technician safety and quality?",
        answer:
            "All technicians undergo rigorous background checks, skill assessments, and training programs. They're rated by customers after each service, and we maintain a minimum 4.5-star rating requirement. Technicians also carry ID badges that you can verify through our app.",
    },
];

const recentTickets: SupportTicket[] = [
    {
        id: "TKT-2024-089",
        subject: "Invoice discrepancy for December service",
        status: "in-progress",
        lastUpdate: "2 hours ago",
        priority: "medium",
    },
    {
        id: "TKT-2024-076",
        subject: "Request for service area expansion",
        status: "resolved",
        lastUpdate: "5 days ago",
        priority: "low",
    },
];

const categories = [
    { id: "all", label: "All Topics", icon: BookOpen },
    { id: "Booking", label: "Booking", icon: Calendar },
    { id: "Payment", label: "Payment", icon: CreditCard },
    { id: "Services", label: "Services", icon: Settings },
    { id: "Account", label: "Account", icon: Shield },
    { id: "Safety", label: "Safety", icon: Zap },
];

const contactMethods = [
    {
        title: "Call Us",
        description: "Speak directly with our support team",
        icon: Phone,
        action: "+971 800 SERVICE",
        actionLabel: "Call Now",
        available: "Available 24/7",
        color: "from-green-500 to-emerald-500",
    },
    {
        title: "Email Support",
        description: "Get a response within 24 hours",
        icon: Mail,
        action: "support@serviceapp.ae",
        actionLabel: "Send Email",
        available: "Response within 24h",
        color: "from-blue-500 to-indigo-500",
    },
    {
        title: "Live Chat",
        description: "Chat with our support agents",
        icon: MessageCircle,
        action: "Start Chat",
        actionLabel: "Start Chat",
        available: "Available 8 AM - 10 PM",
        color: "from-purple-500 to-pink-500",
    },
];

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────
function FAQAccordion({
    items,
    expandedId,
    onToggle,
}: {
    items: FAQItem[];
    expandedId: string | null;
    onToggle: (id: string) => void;
}) {
    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                        "bg-white rounded-xl border overflow-hidden transition-all duration-300",
                        expandedId === item.id
                            ? "border-primary/30 shadow-md ring-2 ring-primary/10"
                            : "border-neutral-200 hover:border-neutral-300"
                    )}
                >
                    <button
                        onClick={() => onToggle(item.id)}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                    expandedId === item.id
                                        ? "bg-primary text-white"
                                        : "bg-neutral-100 text-neutral-500"
                                )}
                            >
                                <HelpCircle className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-neutral-900 text-sm sm:text-base">{item.question}</span>
                        </div>
                        <ChevronDown
                            className={cn(
                                "h-5 w-5 text-neutral-400 transition-transform duration-300",
                                expandedId === item.id && "rotate-180"
                            )}
                        />
                    </button>

                    <AnimatePresence>
                        {expandedId === item.id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="px-4 sm:px-6 pb-4 sm:pb-5 pl-12 sm:pl-17">
                                    <div className="ml-0 sm:ml-11 text-neutral-600 leading-relaxed text-sm sm:text-base">
                                        {item.answer}
                                    </div>
                                    <div className="ml-0 sm:ml-11 mt-4 flex items-center gap-4">
                                        <button className="text-sm text-neutral-500 hover:text-primary transition-colors flex items-center gap-1">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Helpful
                                        </button>
                                        <button className="text-sm text-neutral-500 hover:text-primary transition-colors">
                                            Not helpful
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
}

function ContactCard({
    contact,
    index,
}: {
    contact: (typeof contactMethods)[0];
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm hover:shadow-lg hover:border-neutral-300 transition-all duration-300"
        >
            <div
                className={cn(
                    "h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-5 shadow-lg",
                    contact.color
                )}
            >
                <contact.icon className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {contact.title}
            </h3>
            <p className="text-sm text-neutral-500 mb-4">{contact.description}</p>

            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-5">
                <Clock className="h-3.5 w-3.5" />
                {contact.available}
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors group-hover:bg-primary">
                {contact.actionLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
        </motion.div>
    );
}

function TicketCard({ ticket }: { ticket: SupportTicket }) {
    const statusConfig = {
        open: {
            label: "Open",
            icon: AlertCircle,
            colors: "text-amber-600 bg-amber-50 border-amber-200",
        },
        "in-progress": {
            label: "In Progress",
            icon: Clock,
            colors: "text-blue-600 bg-blue-50 border-blue-200",
        },
        resolved: {
            label: "Resolved",
            icon: CheckCircle2,
            colors: "text-green-600 bg-green-50 border-green-200",
        },
    };

    const StatusIcon = statusConfig[ticket.status].icon;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center border",
                        statusConfig[ticket.status].colors
                    )}
                >
                    <StatusIcon className="h-5 w-5" />
                </div>
                <div>
                    <p className="font-medium text-neutral-900">{ticket.subject}</p>
                    <p className="text-sm text-neutral-500">
                        {ticket.id} • Updated {ticket.lastUpdate}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                <span
                    className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border",
                        statusConfig[ticket.status].colors
                    )}
                >
                    {statusConfig[ticket.status].label}
                </span>
                <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

function NewTicketForm() {
    const [subject, setSubject] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [category, setCategory] = React.useState("");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white">
                    <Headphones className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                        Submit a Support Ticket
                    </h3>
                    <p className="text-sm text-neutral-500">
                        We typically respond within 24 hours
                    </p>
                </div>
            </div>

            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                        <option value="">Select a category</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="service">Service Issue</option>
                        <option value="technician">Technician Feedback</option>
                        <option value="account">Account & Login</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Subject
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief description of your issue"
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        placeholder="Please provide as much detail as possible about your issue..."
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-neutral-500">
                        You can also attach files after submission
                    </p>
                    <Button type="submit" className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Submit Ticket
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function SupportPage() {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [activeCategory, setActiveCategory] = React.useState("all");
    const [expandedFaq, setExpandedFaq] = React.useState<string | null>(null);

    const filteredFaqs = React.useMemo(() => {
        let filtered = faqData;

        if (activeCategory !== "all") {
            filtered = filtered.filter((faq) => faq.category === activeCategory);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(query) ||
                    faq.answer.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [activeCategory, searchQuery]);

    return (
        <div className="min-h-screen bg-neutral-50/50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow pt-20 sm:pt-24 pb-12 sm:pb-16">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-emerald-50/50 to-teal-50/30 py-16 mb-12">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center max-w-2xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/20 text-sm font-medium text-primary mb-6">
                                <Headphones className="h-4 w-4" />
                                We're here to help
                            </div>
                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-3 sm:mb-4">
                                How can we help you?
                            </h1>
                            <p className="text-base sm:text-lg text-neutral-600 mb-6 sm:mb-8 px-2">
                                Find answers to common questions or get in touch with our support
                                team.
                            </p>

                            {/* Search Bar */}
                            <div className="relative max-w-xl mx-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for topics, questions, or keywords..."
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Contact Methods */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-16"
                    >
                        <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
                            Get in Touch
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {contactMethods.map((contact, index) => (
                                <ContactCard key={contact.title} contact={contact} index={index} />
                            ))}
                        </div>
                    </motion.div>

                    {/* FAQ Section */}
                    <div className="mb-16">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-neutral-600">
                                Quick answers to common questions
                            </p>
                        </div>

                        {/* Category Tabs */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                                        activeCategory === cat.id
                                            ? "bg-primary text-white shadow-md"
                                            : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                                    )}
                                >
                                    <cat.icon className="h-4 w-4" />
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* FAQ Accordion */}
                        {filteredFaqs.length > 0 ? (
                            <div className="max-w-3xl mx-auto">
                                <FAQAccordion
                                    items={filteredFaqs}
                                    expandedId={expandedFaq}
                                    onToggle={(id) =>
                                        setExpandedFaq(expandedFaq === id ? null : id)
                                    }
                                />
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="h-16 w-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-neutral-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                    No results found
                                </h3>
                                <p className="text-neutral-500">
                                    Try a different search term or browse by category.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Support Tickets Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Tickets */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-neutral-900">
                                    Your Recent Tickets
                                </h3>
                                <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                                    View all
                                </button>
                            </div>

                            {recentTickets.length > 0 ? (
                                <div className="space-y-3">
                                    {recentTickets.map((ticket) => (
                                        <TicketCard key={ticket.id} ticket={ticket} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
                                    <FileText className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                                    <p className="text-neutral-500">No support tickets yet</p>
                                </div>
                            )}
                        </motion.div>

                        {/* New Ticket Form */}
                        <NewTicketForm />
                    </div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-16 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-8 md:p-12"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Still need help?
                                </h3>
                                <p className="text-neutral-300 mb-6">
                                    Our customer success team is available around the clock to
                                    ensure you have the best experience.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href="/terms"
                                        className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Terms of Service
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                    <a
                                        href="/privacy"
                                        className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors"
                                    >
                                        <Shield className="h-4 w-4" />
                                        Privacy Policy
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            </div>
                            <div className="flex justify-center md:justify-end">
                                <a
                                    href="tel:+971800SERVICE"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 rounded-2xl font-semibold hover:bg-neutral-100 transition-colors shadow-xl"
                                >
                                    <Phone className="h-5 w-5" />
                                    +971 800 SERVICE
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
