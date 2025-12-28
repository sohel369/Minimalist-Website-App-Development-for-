"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    Wrench,
    Calendar,
    MapPin,
    Phone,
    User,
    Filter,
    Search,
    ChevronRight,
    ArrowUpRight,
    Zap,
    Droplets,
    Wind,
    Flame,
    Shield,
    Plus,
    MoreHorizontal,
    Star,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─────────────────────────────────────────────────────────────
// Types & Mock Data
// ─────────────────────────────────────────────────────────────
type RequestStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
type ServiceType = "ac" | "plumbing" | "electrical" | "heating" | "general";

interface ServiceRequest {
    id: string;
    service: string;
    serviceType: ServiceType;
    description: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    status: RequestStatus;
    technician?: {
        name: string;
        phone: string;
        rating: number;
    };
    estimatedCost?: string;
    createdAt: string;
    completedAt?: string;
    notes?: string;
}

const mockRequests: ServiceRequest[] = [
    {
        id: "REQ-2024-001",
        service: "AC Maintenance & Filter Replacement",
        serviceType: "ac",
        description: "Annual maintenance checkup including filter replacement, refrigerant level check, and coil cleaning.",
        scheduledDate: "December 28, 2024",
        scheduledTime: "10:00 AM - 12:00 PM",
        address: "Villa 42, Palm Jumeirah, Dubai",
        status: "in-progress",
        technician: {
            name: "Ahmed Al-Rashid",
            phone: "+971 50 123 4567",
            rating: 4.9,
        },
        estimatedCost: "AED 350",
        createdAt: "December 26, 2024",
        notes: "Technician is currently on-site performing the service.",
    },
    {
        id: "REQ-2024-002",
        service: "Water Heater Installation",
        serviceType: "plumbing",
        description: "Installation of new 80L electric water heater with removal of old unit.",
        scheduledDate: "December 30, 2024",
        scheduledTime: "2:00 PM - 5:00 PM",
        address: "Apt 1204, Marina Heights, Dubai Marina",
        status: "confirmed",
        technician: {
            name: "Mohammed Hassan",
            phone: "+971 55 987 6543",
            rating: 4.8,
        },
        estimatedCost: "AED 850",
        createdAt: "December 25, 2024",
    },
    {
        id: "REQ-2024-003",
        service: "Electrical Panel Upgrade",
        serviceType: "electrical",
        description: "Upgrade main electrical panel from 100A to 200A capacity for new home additions.",
        scheduledDate: "January 3, 2025",
        scheduledTime: "9:00 AM - 1:00 PM",
        address: "Villa 15, Emirates Hills, Dubai",
        status: "pending",
        estimatedCost: "AED 2,500",
        createdAt: "December 24, 2024",
        notes: "Awaiting technician assignment.",
    },
    {
        id: "REQ-2023-892",
        service: "Plumbing Leak Repair",
        serviceType: "plumbing",
        description: "Emergency repair of kitchen sink leak and pipe replacement.",
        scheduledDate: "December 12, 2024",
        scheduledTime: "11:00 AM - 1:00 PM",
        address: "Villa 42, Palm Jumeirah, Dubai",
        status: "completed",
        technician: {
            name: "Ali Mahmoud",
            phone: "+971 52 456 7890",
            rating: 4.7,
        },
        estimatedCost: "AED 180",
        createdAt: "December 11, 2024",
        completedAt: "December 12, 2024",
    },
    {
        id: "REQ-2023-845",
        service: "HVAC System Inspection",
        serviceType: "heating",
        description: "Complete HVAC system inspection and efficiency assessment.",
        scheduledDate: "November 28, 2024",
        scheduledTime: "10:00 AM - 12:00 PM",
        address: "Apt 1204, Marina Heights, Dubai Marina",
        status: "completed",
        technician: {
            name: "Khalid Ibrahim",
            phone: "+971 54 321 0987",
            rating: 5.0,
        },
        estimatedCost: "AED 200",
        createdAt: "November 25, 2024",
        completedAt: "November 28, 2024",
    },
    {
        id: "REQ-2023-801",
        service: "Smart Thermostat Installation",
        serviceType: "electrical",
        description: "Installation and configuration of Nest smart thermostat.",
        scheduledDate: "November 15, 2024",
        scheduledTime: "3:00 PM - 5:00 PM",
        address: "Villa 42, Palm Jumeirah, Dubai",
        status: "cancelled",
        createdAt: "November 12, 2024",
        notes: "Cancelled by customer - rescheduling for January.",
    },
];

// ─────────────────────────────────────────────────────────────
// Configurations
// ─────────────────────────────────────────────────────────────
const statusConfig: Record<RequestStatus, { label: string; icon: React.ElementType; colors: string }> = {
    pending: {
        label: "Pending",
        icon: Clock,
        colors: "text-amber-600 bg-amber-50 border-amber-200",
    },
    confirmed: {
        label: "Confirmed",
        icon: CheckCircle2,
        colors: "text-blue-600 bg-blue-50 border-blue-200",
    },
    "in-progress": {
        label: "In Progress",
        icon: AlertCircle,
        colors: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    completed: {
        label: "Completed",
        icon: CheckCircle2,
        colors: "text-green-600 bg-green-50 border-green-200",
    },
    cancelled: {
        label: "Cancelled",
        icon: AlertCircle,
        colors: "text-neutral-500 bg-neutral-100 border-neutral-200",
    },
};

const serviceIcons: Record<ServiceType, React.ElementType> = {
    ac: Wind,
    plumbing: Droplets,
    electrical: Zap,
    heating: Flame,
    general: Wrench,
};

const serviceColors: Record<ServiceType, string> = {
    ac: "from-sky-500 to-cyan-400",
    plumbing: "from-blue-500 to-indigo-400",
    electrical: "from-amber-500 to-yellow-400",
    heating: "from-orange-500 to-red-400",
    general: "from-neutral-500 to-slate-400",
};

// ─────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────
function RequestCard({ request, index }: { request: ServiceRequest; index: number }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const StatusIcon = statusConfig[request.status].icon;
    const ServiceIcon = serviceIcons[request.serviceType];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            layout
            className={cn(
                "group relative bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300",
                request.status === "in-progress"
                    ? "border-emerald-200 ring-2 ring-emerald-100"
                    : "border-neutral-200 hover:border-neutral-300 hover:shadow-md"
            )}
        >
            {/* Status Indicator Bar */}
            <div
                className={cn(
                    "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
                    request.status === "in-progress" && "from-emerald-400 to-teal-400",
                    request.status === "pending" && "from-amber-400 to-orange-400",
                    request.status === "confirmed" && "from-blue-400 to-indigo-400",
                    request.status === "completed" && "from-green-400 to-emerald-400",
                    request.status === "cancelled" && "from-neutral-300 to-neutral-400"
                )}
            />

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        {/* Service Icon */}
                        <div
                            className={cn(
                                "relative h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg",
                                serviceColors[request.serviceType]
                            )}
                        >
                            <ServiceIcon className="h-7 w-7" />
                            {request.status === "in-progress" && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                                </span>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-neutral-900 text-base sm:text-lg leading-tight truncate">
                                {request.service}
                            </h3>
                            <p className="text-sm text-neutral-500 mt-0.5">{request.id}</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
                            statusConfig[request.status].colors
                        )}
                    >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusConfig[request.status].label}
                    </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar className="h-4 w-4 text-neutral-400" />
                        <span>{request.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Clock className="h-4 w-4 text-neutral-400" />
                        <span>{request.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 col-span-2">
                        <MapPin className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                        <span className="truncate">{request.address}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                    {request.description}
                </p>

                {/* Expandable Details */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 border-t border-neutral-100 space-y-4">
                                {/* Technician Info */}
                                {request.technician && (
                                    <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white font-medium">
                                                {request.technician.name.split(" ").map((n) => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="font-medium text-neutral-900">{request.technician.name}</p>
                                                <div className="flex items-center gap-1 text-sm text-neutral-500">
                                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                    <span>{request.technician.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <a
                                            href={`tel:${request.technician.phone}`}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            <Phone className="h-4 w-4" />
                                            Call
                                        </a>
                                    </div>
                                )}

                                {/* Cost & Notes */}
                                <div className="grid grid-cols-2 gap-4">
                                    {request.estimatedCost && (
                                        <div>
                                            <p className="text-xs text-neutral-500 mb-1">Estimated Cost</p>
                                            <p className="font-semibold text-neutral-900">{request.estimatedCost}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Created</p>
                                        <p className="font-medium text-neutral-700">{request.createdAt}</p>
                                    </div>
                                </div>

                                {request.notes && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                                        <p className="text-sm text-amber-800">{request.notes}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-4">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        {isExpanded ? "Show less" : "View details"}
                    </button>

                    <div className="flex items-center gap-2">
                        {request.status === "in-progress" && (
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
                                Track Live
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                        )}
                        <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function FilterTabs({
    activeFilter,
    onFilterChange,
}: {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}) {
    const filters = [
        { id: "all", label: "All Requests", count: mockRequests.length },
        { id: "active", label: "Active", count: mockRequests.filter((r) => ["pending", "confirmed", "in-progress"].includes(r.status)).length },
        { id: "completed", label: "Completed", count: mockRequests.filter((r) => r.status === "completed").length },
        { id: "cancelled", label: "Cancelled", count: mockRequests.filter((r) => r.status === "cancelled").length },
    ];

    return (
        <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl overflow-x-auto">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                        activeFilter === filter.id
                            ? "bg-white text-neutral-900 shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900"
                    )}
                >
                    {filter.label}
                    <span
                        className={cn(
                            "px-2 py-0.5 rounded-full text-xs",
                            activeFilter === filter.id
                                ? "bg-primary/10 text-primary"
                                : "bg-neutral-200 text-neutral-500"
                        )}
                    >
                        {filter.count}
                    </span>
                </button>
            ))}
        </div>
    );
}

function StatsCards() {
    const stats = [
        {
            label: "Active Requests",
            value: "3",
            change: "+1 this week",
            icon: AlertCircle,
            color: "from-blue-500 to-indigo-500",
        },
        {
            label: "Completed",
            value: "28",
            change: "This year",
            icon: CheckCircle2,
            color: "from-green-500 to-emerald-500",
        },
        {
            label: "Avg. Response",
            value: "2.4h",
            change: "-30min avg",
            icon: Clock,
            color: "from-amber-500 to-orange-500",
        },
        {
            label: "Satisfaction",
            value: "4.9",
            change: "Based on 28 reviews",
            icon: Star,
            color: "from-purple-500 to-pink-500",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl sm:rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div
                            className={cn(
                                "h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white",
                                stat.color
                            )}
                        >
                            <stat.icon className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1">{stat.value}</p>
                    <p className="text-[10px] sm:text-xs text-neutral-500">{stat.change}</p>
                    <p className="text-xs sm:text-sm font-medium text-neutral-600 mt-1">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function RequestsPage() {
    const [activeFilter, setActiveFilter] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredRequests = React.useMemo(() => {
        let filtered = mockRequests;

        // Filter by status
        if (activeFilter === "active") {
            filtered = filtered.filter((r) =>
                ["pending", "confirmed", "in-progress"].includes(r.status)
            );
        } else if (activeFilter === "completed") {
            filtered = filtered.filter((r) => r.status === "completed");
        } else if (activeFilter === "cancelled") {
            filtered = filtered.filter((r) => r.status === "cancelled");
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (r) =>
                    r.service.toLowerCase().includes(query) ||
                    r.id.toLowerCase().includes(query) ||
                    r.address.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [activeFilter, searchQuery]);

    return (
        <div className="min-h-screen bg-neutral-50/50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-20 sm:pt-24 pb-8 sm:pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1 sm:mb-2">
                                    My Requests
                                </h1>
                                <p className="text-sm sm:text-base text-neutral-600">
                                    Track and manage all your service requests in one place.
                                </p>
                            </div>
                            <Link href="/book">
                                <Button className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    New Request
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <StatsCards />

                    {/* Filters & Search */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search requests..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 w-full lg:w-72 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Requests List */}
                    <div className="space-y-4">
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((request, index) => (
                                <RequestCard key={request.id} request={request} index={index} />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-2xl border border-neutral-200 p-12 text-center"
                            >
                                <div className="h-16 w-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-neutral-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                    No requests found
                                </h3>
                                <p className="text-neutral-500 mb-6">
                                    {searchQuery
                                        ? "Try adjusting your search or filters."
                                        : "You don't have any requests in this category yet."}
                                </p>
                                <Link href="/book">
                                    <Button>Book a New Service</Button>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
