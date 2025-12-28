"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Clock, CheckCircle2, AlertCircle, Wrench, Calendar, MapPin, Phone,
    Search, ArrowUpRight, Zap, Droplets, Wind, Flame, Plus, XCircle,
    Activity, Loader2, ClipboardList, User, Star, MessageCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";

type RequestStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
type ServiceType = "ac" | "plumbing" | "electrical" | "heating" | "painting" | "general";

interface Technician {
    name: string;
    phone: string;
    rating: number;
}

interface ServiceRequest {
    id: string;
    service: string;
    serviceType: ServiceType;
    description?: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    status: RequestStatus;
    technician?: Technician;
    estimatedCost?: number;
    adminNotes?: string;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

const statusConfig: Record<RequestStatus, { label: string; icon: React.ElementType; colors: string; message: string }> = {
    pending: { label: "Pending", icon: Clock, colors: "text-amber-600 bg-amber-50 border-amber-200", message: "Waiting for confirmation" },
    confirmed: { label: "Confirmed", icon: CheckCircle2, colors: "text-blue-600 bg-blue-50 border-blue-200", message: "Technician assigned" },
    "in-progress": { label: "In Progress", icon: Activity, colors: "text-emerald-600 bg-emerald-50 border-emerald-200", message: "Service is being performed" },
    completed: { label: "Completed", icon: CheckCircle2, colors: "text-green-600 bg-green-50 border-green-200", message: "Service completed successfully" },
    cancelled: { label: "Cancelled", icon: XCircle, colors: "text-neutral-500 bg-neutral-100 border-neutral-200", message: "Request was cancelled" },
};

const serviceIcons: Record<ServiceType, React.ElementType> = {
    ac: Wind, plumbing: Droplets, electrical: Zap, heating: Flame, painting: Wrench, general: Wrench,
};

const serviceColors: Record<ServiceType, string> = {
    ac: "from-sky-500 to-cyan-400", plumbing: "from-blue-500 to-indigo-400", electrical: "from-amber-500 to-yellow-400",
    heating: "from-orange-500 to-red-400", painting: "from-purple-500 to-pink-400", general: "from-neutral-500 to-slate-400",
};

function RequestCard({ request, index }: { request: ServiceRequest; index: number }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const StatusIcon = statusConfig[request.status]?.icon || Clock;
    const ServiceIcon = serviceIcons[request.serviceType] || Wrench;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
                "bg-white rounded-xl sm:rounded-2xl border shadow-sm overflow-hidden",
                request.status === "in-progress" ? "border-emerald-200 ring-2 ring-emerald-100" : "border-neutral-200"
            )}
        >
            <div className={cn("h-1 bg-gradient-to-r",
                request.status === "in-progress" && "from-emerald-400 to-teal-400",
                request.status === "pending" && "from-amber-400 to-orange-400",
                request.status === "confirmed" && "from-blue-400 to-indigo-400",
                request.status === "completed" && "from-green-400 to-emerald-400",
                request.status === "cancelled" && "from-neutral-300 to-neutral-400"
            )} />

            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg flex-shrink-0", serviceColors[request.serviceType] || "from-neutral-500 to-slate-400")}>
                            <ServiceIcon className="h-6 w-6" />
                            {request.status === "in-progress" && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-semibold text-neutral-900 text-base sm:text-lg truncate">{request.service}</h3>
                            <p className="text-xs text-neutral-500">REQ-{request.id.substring(0, 8).toUpperCase()}</p>
                        </div>
                    </div>
                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0", statusConfig[request.status]?.colors)}>
                        <StatusIcon className="h-3 w-3" />
                        <span className="hidden sm:inline">{statusConfig[request.status]?.label}</span>
                    </div>
                </div>

                {/* Status Message */}
                <div className={cn("px-3 py-2 rounded-lg mb-4 text-sm", statusConfig[request.status]?.colors.replace("border-", "bg-").replace("text-", "text-"))}>
                    {statusConfig[request.status]?.message}
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-neutral-600"><Calendar className="h-4 w-4 text-neutral-400" />{request.scheduledDate}</div>
                    <div className="flex items-center gap-2 text-neutral-600"><Clock className="h-4 w-4 text-neutral-400" />{request.scheduledTime}</div>
                    <div className="flex items-center gap-2 text-neutral-600 col-span-full"><MapPin className="h-4 w-4 text-neutral-400 flex-shrink-0" /><span className="truncate">{request.address}</span></div>
                </div>

                {/* Technician Info - Shows when assigned by admin */}
                {request.technician && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-4 border border-emerald-100">
                        <p className="text-xs text-emerald-600 font-medium mb-2">Assigned Technician</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-medium">
                                    {request.technician.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-900">{request.technician.name}</p>
                                    <div className="flex items-center gap-1 text-sm text-neutral-500">
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        <span>{request.technician.rating}</span>
                                    </div>
                                </div>
                            </div>
                            <a href={`tel:${request.technician.phone}`} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                                <Phone className="h-4 w-4" />Call
                            </a>
                        </div>
                    </div>
                )}

                {/* Estimated Cost */}
                {request.estimatedCost && (
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg mb-4">
                        <span className="text-sm text-neutral-600">Estimated Cost</span>
                        <span className="font-semibold text-neutral-900">AED {request.estimatedCost}</span>
                    </div>
                )}

                {/* Admin Notes */}
                {request.adminNotes && (
                    <div className="p-3 bg-blue-50 rounded-lg mb-4 border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium mb-1">Note from ServiceApp</p>
                        <p className="text-sm text-blue-800">{request.adminNotes}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <p className="text-xs text-neutral-500">Created: {request.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}</p>
                    <div className="flex items-center gap-2">
                        {request.status === "in-progress" && (
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100">
                                Track Live <ArrowUpRight className="h-4 w-4" />
                            </button>
                        )}
                        {request.status === "completed" && (
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-200">
                                <MessageCircle className="h-4 w-4" /> Rate Service
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function RequestsPage() {
    const { user, loading: authLoading } = useAuth();
    const [requests, setRequests] = React.useState<ServiceRequest[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [activeFilter, setActiveFilter] = React.useState("all");

    React.useEffect(() => {
        if (!user?.uid) { setLoading(false); return; }
        const q = query(collection(db, "requests"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: ServiceRequest[] = [];
            snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as ServiceRequest));
            setRequests(data);
            setLoading(false);
        }, () => setLoading(false));
        return () => unsubscribe();
    }, [user?.uid]);

    const counts = React.useMemo(() => ({
        all: requests.length,
        active: requests.filter(r => ["pending", "confirmed", "in-progress"].includes(r.status)).length,
        completed: requests.filter(r => r.status === "completed").length,
    }), [requests]);

    const filteredRequests = React.useMemo(() => {
        if (activeFilter === "active") return requests.filter(r => ["pending", "confirmed", "in-progress"].includes(r.status));
        if (activeFilter === "completed") return requests.filter(r => r.status === "completed");
        return requests;
    }, [requests, activeFilter]);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;

    return (
        <div className="min-h-screen bg-neutral-50/50 flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20 sm:pt-24 pb-8 sm:pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-1">My Requests</h1>
                                <p className="text-sm text-neutral-600">Track your service requests in real-time</p>
                            </div>
                            <Link href="/book"><Button className="flex items-center gap-2"><Plus className="h-4 w-4" />Book Service</Button></Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                            { label: "Total", value: counts.all, color: "bg-neutral-100" },
                            { label: "Active", value: counts.active, color: "bg-emerald-50 text-emerald-700" },
                            { label: "Completed", value: counts.completed, color: "bg-green-50 text-green-700" },
                        ].map((s) => (
                            <div key={s.label} className={cn("rounded-xl p-4 text-center", s.color)}>
                                <p className="text-2xl font-bold">{s.value}</p>
                                <p className="text-xs">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {["all", "active", "completed"].map((f) => (
                            <button key={f} onClick={() => setActiveFilter(f)}
                                className={cn("px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap",
                                    activeFilter === f ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300")}>
                                {f} ({f === "all" ? counts.all : f === "active" ? counts.active : counts.completed})
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="bg-white rounded-2xl p-12 text-center border"><Loader2 className="h-8 w-8 animate-spin text-neutral-400 mx-auto mb-4" /><p className="text-neutral-500">Loading...</p></div>
                        ) : filteredRequests.length > 0 ? (
                            filteredRequests.map((r, i) => <RequestCard key={r.id} request={r} index={i} />)
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border">
                                <ClipboardList className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{requests.length === 0 ? "No requests yet" : "No requests found"}</h3>
                                <p className="text-neutral-500 mb-6">{requests.length === 0 ? "Book your first service!" : "Try a different filter"}</p>
                                {requests.length === 0 && <Link href="/book"><Button>Book a Service</Button></Link>}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
