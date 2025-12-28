"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    Settings,
    LogOut,
    Search,
    Filter,
    ChevronDown,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    User,
    Phone,
    MapPin,
    Calendar,
    Wrench,
    Download,
    RefreshCw,
    Eye,
    Edit,
    MoreVertical,
    Menu,
    X,
    ChevronRight,
    TrendingUp,
    Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp } from "firebase/firestore";

// Types
interface ServiceRequest {
    id: string;
    userId: string;
    userPhone: string;
    userName: string;
    service: string;
    serviceType: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    addressType: string;
    description?: string;
    status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
    assignedTo?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Status Config
const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
    confirmed: { label: "Confirmed", icon: CheckCircle2, color: "text-blue-600 bg-blue-50 border-blue-200" },
    "in-progress": { label: "In Progress", icon: Activity, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    completed: { label: "Completed", icon: CheckCircle2, color: "text-green-600 bg-green-50 border-green-200" },
    cancelled: { label: "Cancelled", icon: XCircle, color: "text-neutral-500 bg-neutral-100 border-neutral-200" },
};

// Sidebar Items
const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "requests", label: "Requests", icon: ClipboardList },
    { id: "staff", label: "Staff", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = React.useState("requests");
    const [requests, setRequests] = React.useState<ServiceRequest[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [selectedRequest, setSelectedRequest] = React.useState<ServiceRequest | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Fetch requests from Firestore
    React.useEffect(() => {
        const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));

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
    }, []);

    // Filter requests
    const filteredRequests = React.useMemo(() => {
        let filtered = requests;

        if (statusFilter !== "all") {
            filtered = filtered.filter(r => r.status === statusFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                r.id.toLowerCase().includes(query) ||
                r.userName?.toLowerCase().includes(query) ||
                r.userPhone?.includes(query) ||
                r.service?.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [requests, statusFilter, searchQuery]);

    // Stats
    const stats = React.useMemo(() => ({
        total: requests.length,
        pending: requests.filter(r => r.status === "pending").length,
        inProgress: requests.filter(r => r.status === "in-progress" || r.status === "confirmed").length,
        completed: requests.filter(r => r.status === "completed").length,
    }), [requests]);

    // Update request status
    const updateStatus = async (requestId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, "requests", requestId), {
                status: newStatus,
                updatedAt: Timestamp.now(),
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ["ID", "Customer", "Phone", "Service", "Date", "Time", "Address", "Status", "Created"];
        const rows = filteredRequests.map(r => [
            r.id,
            r.userName,
            r.userPhone,
            r.service,
            r.scheduledDate,
            r.scheduledTime,
            r.address,
            r.status,
            r.createdAt?.toDate?.()?.toLocaleDateString() || "",
        ]);

        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `requests-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    return (
        <div className="min-h-screen bg-neutral-100 flex">
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 transform transition-transform duration-300 lg:translate-x-0 lg:static",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-neutral-800">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                                S
                            </div>
                            <div>
                                <h1 className="font-semibold text-white">ServiceApp</h1>
                                <p className="text-xs text-neutral-500">Admin Panel</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 p-4 space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                    activeTab === item.id
                                        ? "bg-emerald-600 text-white"
                                        : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-neutral-800">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 capitalize">{activeTab}</h1>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Button variant="outline" size="sm" onClick={exportToCSV} className="hidden sm:flex">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium text-sm">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                {activeTab === "dashboard" && (
                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: "Total Requests", value: stats.total, icon: ClipboardList, color: "from-blue-500 to-indigo-500" },
                                { label: "Pending", value: stats.pending, icon: Clock, color: "from-amber-500 to-orange-500" },
                                { label: "In Progress", value: stats.inProgress, icon: Activity, color: "from-emerald-500 to-teal-500" },
                                { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm"
                                >
                                    <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-4", stat.color)}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900">{stat.value}</p>
                                    <p className="text-sm text-neutral-500">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h2>
                            <p className="text-neutral-500 text-sm">View all requests in the Requests tab.</p>
                        </div>
                    </div>
                )}

                {/* Requests Content */}
                {activeTab === "requests" && (
                    <div className="p-4 sm:p-6 lg:p-8">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search by ID, name, phone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Requests List */}
                        {loading ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <RefreshCw className="h-8 w-8 animate-spin text-neutral-400 mx-auto mb-4" />
                                <p className="text-neutral-500">Loading requests...</p>
                            </div>
                        ) : filteredRequests.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center">
                                <ClipboardList className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No requests found</h3>
                                <p className="text-neutral-500">Try adjusting your filters or wait for new bookings.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredRequests.map((request, index) => {
                                    const StatusIcon = statusConfig[request.status]?.icon || Clock;
                                    return (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="bg-white rounded-xl sm:rounded-2xl border border-neutral-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 font-medium text-sm">
                                                        {request.userName?.substring(0, 2).toUpperCase() || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-neutral-900">{request.userName || "User"}</p>
                                                        <p className="text-sm text-neutral-500">{request.userPhone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border",
                                                        statusConfig[request.status]?.color
                                                    )}>
                                                        <StatusIcon className="h-3.5 w-3.5" />
                                                        {statusConfig[request.status]?.label}
                                                    </span>
                                                    <select
                                                        value={request.status}
                                                        onChange={(e) => updateStatus(request.id, e.target.value)}
                                                        className="text-xs border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="in-progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <Wrench className="h-4 w-4 text-neutral-400" />
                                                    <span>{request.service}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <Calendar className="h-4 w-4 text-neutral-400" />
                                                    <span>{request.scheduledDate}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <Clock className="h-4 w-4 text-neutral-400" />
                                                    <span>{request.scheduledTime}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-600">
                                                    <MapPin className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                                                    <span className="truncate">{request.address}</span>
                                                </div>
                                            </div>

                                            {request.description && (
                                                <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                                                    <p className="text-sm text-neutral-600">{request.description}</p>
                                                </div>
                                            )}

                                            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                                                <p className="text-xs text-neutral-500">
                                                    ID: {request.id.substring(0, 8).toUpperCase()} •
                                                    Created: {request.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Staff Content */}
                {activeTab === "staff" && (
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="bg-white rounded-2xl p-12 text-center">
                            <Users className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Staff Management</h3>
                            <p className="text-neutral-500 mb-6">Add and manage your technicians and staff members.</p>
                            <Button>Add Staff Member</Button>
                        </div>
                    </div>
                )}

                {/* Settings Content */}
                {activeTab === "settings" && (
                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="bg-white rounded-2xl p-12 text-center">
                            <Settings className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Settings</h3>
                            <p className="text-neutral-500">Configure your admin panel settings.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
