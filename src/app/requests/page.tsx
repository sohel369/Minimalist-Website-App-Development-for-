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
    Search,
    ChevronRight,
    ArrowUpRight,
    Zap,
    Droplets,
    Wind,
    Flame,
    Plus,
    MoreHorizontal,
    Star,
    XCircle,
    Activity,
    Loader2,
    ClipboardList,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";

// Types
type RequestStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
type ServiceType = "ac" | "plumbing" | "electrical" | "heating" | "painting" | "general";

interface ServiceRequest {
    id: string;
    service: string;
    serviceType: ServiceType;
    description?: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    addressType: string;
    status: RequestStatus;
    createdAt: Timestamp;
}

// Configurations
const statusConfig: Record<RequestStatus, { label: string; icon: React.ElementType; colors: string }> = {
    pending: { label: "Pending", icon: Clock, colors: "text-amber-600 bg-amber-50 border-amber-200" },
    confirmed: { label: "Confirmed", icon: CheckCircle2, colors: "text-blue-600 bg-blue-50 border-blue-200" },
    "in-progress": { label: "In Progress", icon: Activity, colors: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    completed: { label: "Completed", icon: CheckCircle2, colors: "text-green-600 bg-green-50 border-green-200" },
    cancelled: { label: "Cancelled", icon: XCircle, colors: "text-neutral-500 bg-neutral-100 border-neutral-200" },
};

const serviceIcons: Record<ServiceType, React.ElementType> = {
    ac: Wind,
    plumbing: Droplets,
    electrical: Zap,
    heating: Flame,
    painting: Wrench,
    general: Wrench,
};

const serviceColors: Record<ServiceType, string> = {
    ac: "from-sky-500 to-cyan-400",
    plumbing: "from-blue-500 to-indigo-400",
    electrical: "from-amber-500 to-yellow-400",
    heating: "from-orange-500 to-red-400",
    painting: "from-purple-500 to-pink-400",
    general: "from-neutral-500 to-slate-400",
};

// Components
function RequestCard({ request, index }: { request: ServiceRequest; index: number }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const StatusIcon = statusConfig[request.status]?.icon || Clock;
    const ServiceIcon = serviceIcons[request.serviceType] || Wrench;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            layout
            className={cn(
                "group relative bg-white rounded-xl sm:rounded-2xl border shadow-sm overflow-hidden transition-all duration-300",
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

            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        {/* Service Icon */}
                        <div
                            className={cn(
                                "relative h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg flex-shrink-0",
                                serviceColors[request.serviceType] || "from-neutral-500 to-slate-400"
                            )}
                        >
                            <ServiceIcon className="h-6 w-6 sm:h-7 sm:w-7" />
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
                            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">REQ-{request.id.substring(0, 8).toUpperCase()}</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div
                        className={cn(
                            "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium border flex-shrink-0",
                            statusConfig[request.status]?.colors
                        )}
                    >
                        <StatusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden sm:inline">{statusConfig[request.status]?.label}</span>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400" />
                        <span>{request.scheduledDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400" />
                        <span>{request.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 col-span-1 sm:col-span-2">
                        <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-400 flex-shrink-0" />
                        <span className="truncate">{request.address}</span>
                    </div>
                </div>

                {/* Description */}
                {request.description && (
                    <p className="text-xs sm:text-sm text-neutral-600 mb-3 sm:mb-4 line-clamp-2">
                        {request.description}
                    </p>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-neutral-100">
                    <p className="text-[10px] sm:text-xs text-neutral-500">
                        Created: {request.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                    </p>

                    <div className="flex items-center gap-2">
                        {request.status === "in-progress" && (
                            <button className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-emerald-100 transition-colors">
                                <span className="hidden sm:inline">Track Live</span>
                                <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function FilterTabs({
    activeFilter,
    onFilterChange,
    counts,
}: {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    counts: { all: number; active: number; completed: number; cancelled: number };
}) {
    const filters = [
        { id: "all", label: "All", count: counts.all },
        { id: "active", label: "Active", count: counts.active },
        { id: "completed", label: "Completed", count: counts.completed },
        { id: "cancelled", label: "Cancelled", count: counts.cancelled },
    ];

    return (
        <div className="flex items-center gap-1 sm:gap-2 p-1 bg-neutral-100 rounded-xl overflow-x-auto">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => onFilterChange(filter.id)}
                    className={cn(
                        "flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
                        activeFilter === filter.id
                            ? "bg-white text-neutral-900 shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900"
                    )}
                >
                    {filter.label}
                    <span
                        className={cn(
                            "px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs",
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

function StatsCards({ requests }: { requests: ServiceRequest[] }) {
    const stats = [
        {
            label: "Active",
            value: requests.filter(r => ["pending", "confirmed", "in-progress"].includes(r.status)).length,
            icon: Activity,
            color: "from-blue-500 to-indigo-500",
        },
        {
            label: "Completed",
            value: requests.filter(r => r.status === "completed").length,
            icon: CheckCircle2,
            color: "from-green-500 to-emerald-500",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl sm:rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div
                            className={cn(
                                "h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-br flex items-center justify-center text-white",
                                stat.color
                            )}
                        >
                            <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-neutral-900">{stat.value}</p>
                    <p className="text-xs sm:text-sm font-medium text-neutral-600">{stat.label}</p>
                </motion.div>
            ))}
        </div>
    );
}

// Main Page
export default function RequestsPage() {
    const { user, loading: authLoading } = useAuth();
    const [requests, setRequests] = React.useState<ServiceRequest[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [activeFilter, setActiveFilter] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");

    // Fetch user's requests from Firestore
    React.useEffect(() => {
        if (!user?.uid) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "requests"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requestsData: ServiceRequest[] = [];
            snapshot.forEach((doc) => {
                requestsData.push({ id: doc.id, ...doc.data() } as ServiceRequest);
            });
            setRequests(requestsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching requests:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.uid]);

    // Filter counts
    const counts = React.useMemo(() => ({
        all: requests.length,
        active: requests.filter(r => ["pending", "confirmed", "in-progress"].includes(r.status)).length,
        completed: requests.filter(r => r.status === "completed").length,
        cancelled: requests.filter(r => r.status === "cancelled").length,
    }), [requests]);

    // Filter requests
    const filteredRequests = React.useMemo(() => {
        let filtered = requests;

        if (activeFilter === "active") {
            filtered = filtered.filter(r => ["pending", "confirmed", "in-progress"].includes(r.status));
        } else if (activeFilter === "completed") {
            filtered = filtered.filter(r => r.status === "completed");
        } else if (activeFilter === "cancelled") {
            filtered = filtered.filter(r => r.status === "cancelled");
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.service?.toLowerCase().includes(query) ||
                r.id.toLowerCase().includes(query) ||
                r.address?.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [requests, activeFilter, searchQuery]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow pt-20 sm:pt-24 pb-8 sm:pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 sm:mb-8"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1 sm:mb-2">
                                    My Requests
                                </h1>
                                <p className="text-sm sm:text-base text-neutral-600">
                                    Track and manage your service requests.
                                </p>
                            </div>
                            <Link href="/book">
                                <Button className="flex items-center gap-2 w-full sm:w-auto">
                                    <Plus className="h-4 w-4" />
                                    Book Service
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <StatsCards requests={requests} />

                    {/* Filters & Search */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />

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
                        {loading ? (
                            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                                <Loader2 className="h-8 w-8 animate-spin text-neutral-400 mx-auto mb-4" />
                                <p className="text-neutral-500">Loading your requests...</p>
                            </div>
                        ) : filteredRequests.length > 0 ? (
                            filteredRequests.map((request, index) => (
                                <RequestCard key={request.id} request={request} index={index} />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center"
                            >
                                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                                    <ClipboardList className="h-7 w-7 sm:h-8 sm:w-8 text-neutral-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                    {requests.length === 0 ? "No requests yet" : "No requests found"}
                                </h3>
                                <p className="text-neutral-500 mb-6 text-sm sm:text-base">
                                    {requests.length === 0
                                        ? "Book your first service to get started."
                                        : "Try adjusting your search or filters."}
                                </p>
                                {requests.length === 0 && (
                                    <Link href="/book">
                                        <Button>Book a Service</Button>
                                    </Link>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
