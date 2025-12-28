"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, ClipboardList, Users, Settings, LogOut, Search,
    Clock, CheckCircle2, XCircle, MapPin, Calendar, Wrench, Download,
    RefreshCw, Menu, TrendingUp, Activity, Bell, ChevronRight, BarChart3,
    DollarSign, ArrowUpRight, ArrowDownRight, MoreVertical, Zap, Award,
    UserCheck, Phone, Mail, Star, Shield, Bell as BellIcon,
    Save, Plus, Edit, Trash2, X, MessageSquare, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp, addDoc, deleteDoc } from "firebase/firestore";

interface Technician {
    name: string;
    phone: string;
    rating: number;
}

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
    status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
    technician?: Technician;
    estimatedCost?: number;
    adminNotes?: string;
    description?: string;
    createdAt: Timestamp;
}

interface StaffMember {
    id: string; name: string; phone: string; email: string; role: string;
    status: "active" | "inactive"; rating: number; completedJobs: number;
}

const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    confirmed: { label: "Confirmed", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-500/10" },
    "in-progress": { label: "In Progress", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    completed: { label: "Completed", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    cancelled: { label: "Cancelled", icon: XCircle, color: "text-neutral-400", bg: "bg-neutral-500/10" },
};

const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "requests", label: "Requests", icon: ClipboardList },
    { id: "staff", label: "Staff", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
];

const mockStaff: StaffMember[] = [
    { id: "1", name: "Ahmed Al-Rashid", phone: "+971 50 123 4567", email: "ahmed@service.app", role: "Senior Technician", status: "active", rating: 4.9, completedJobs: 156 },
    { id: "2", name: "Mohammed Hassan", phone: "+971 55 987 6543", email: "mohammed@service.app", role: "Electrician", status: "active", rating: 4.8, completedJobs: 98 },
    { id: "3", name: "Ali Mahmoud", phone: "+971 52 456 7890", email: "ali@service.app", role: "Plumber", status: "active", rating: 4.7, completedJobs: 124 },
    { id: "4", name: "Khalid Ibrahim", phone: "+971 54 321 0987", email: "khalid@service.app", role: "HVAC Specialist", status: "inactive", rating: 5.0, completedJobs: 87 },
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = React.useState("dashboard");
    const [requests, setRequests] = React.useState<ServiceRequest[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const [editingRequest, setEditingRequest] = React.useState<ServiceRequest | null>(null);
    const [tempTechId, setTempTechId] = React.useState("");
    const [tempCost, setTempCost] = React.useState("");
    const [tempNotes, setTempNotes] = React.useState("");

    React.useEffect(() => {
        const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: ServiceRequest[] = [];
            snapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as ServiceRequest));
            setRequests(data);
            setLoading(false);
        }, () => setLoading(false));
        return () => unsubscribe();
    }, []);

    const stats = React.useMemo(() => ({
        total: requests.length,
        pending: requests.filter(r => r.status === "pending").length,
        inProgress: requests.filter(r => ["in-progress", "confirmed"].includes(r.status)).length,
        completed: requests.filter(r => r.status === "completed").length,
        revenue: requests.filter(r => r.status === "completed").reduce((acc, r) => acc + (r.estimatedCost || 0), 0),
    }), [requests]);

    const filteredRequests = React.useMemo(() => {
        let filtered = requests;
        if (statusFilter !== "all") filtered = filtered.filter(r => r.status === statusFilter);
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(r => r.userName?.toLowerCase().includes(q) || r.service?.toLowerCase().includes(q));
        }
        return filtered;
    }, [requests, statusFilter, searchQuery]);

    const updateStatus = async (id: string, status: string) => {
        await updateDoc(doc(db, "requests", id), { status, updatedAt: Timestamp.now() });
    };

    const handleEditRequest = (request: ServiceRequest) => {
        setEditingRequest(request);
        setTempTechId(request.technician ? mockStaff.find(s => s.name === request.technician?.name)?.id || "" : "");
        setTempCost(request.estimatedCost?.toString() || "");
        setTempNotes(request.adminNotes || "");
    };

    const saveRequestDetails = async () => {
        if (!editingRequest) return;
        const updates: any = { updatedAt: Timestamp.now() };
        if (tempTechId) {
            const staff = mockStaff.find(s => s.id === tempTechId);
            if (staff) {
                updates.technician = { name: staff.name, phone: staff.phone, rating: staff.rating };
                if (editingRequest.status === "pending") updates.status = "confirmed";
            }
        }
        if (tempCost) updates.estimatedCost = parseFloat(tempCost);
        if (tempNotes) updates.adminNotes = tempNotes;
        await updateDoc(doc(db, "requests", editingRequest.id), updates);
        setEditingRequest(null);
    };

    const exportCSV = () => {
        const csv = [["ID", "Customer", "Service", "Date", "Status", "Cost", "Technician"], ...filteredRequests.map(r => [r.id, r.userName, r.service, r.scheduledDate, r.status, r.estimatedCost || 0, r.technician?.name || "Unassigned"])].map(r => r.join(",")).join("\n");
        const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv])); a.download = "requests.csv"; a.click();
    };

    const CardWrapper = ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div className={cn("bg-[#12121a]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6 w-full shadow-lg h-full", className)}>{children}</div>
    );

    return (
        <div className="h-screen w-full bg-[#0a0a0f] flex text-white font-sans overflow-hidden">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            </div>

            {/* Sidebar */}
            <aside className={cn("fixed inset-y-0 left-0 z-50 w-72 bg-[#12121a]/90 backdrop-blur-xl border-r border-white/5 transform transition-transform lg:translate-x-0 lg:static flex-shrink-0 h-full flex flex-col", isSidebarOpen ? "translate-x-0" : "-translate-x-full")}>
                <div className="p-6 border-b border-white/5 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div><h1 className="font-bold text-lg">ServiceApp</h1><p className="text-xs text-white/40">Admin Console</p></div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {sidebarItems.map((item) => (
                        <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={cn("w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all",
                                activeTab === item.id ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border border-white/10" : "text-white/50 hover:text-white hover:bg-white/5")}>
                            <item.icon className={cn("h-5 w-5", activeTab === item.id ? "text-emerald-400" : "text-white/40")} />
                            {item.label}
                            {item.id === "requests" && stats.pending > 0 && <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-white">{stats.pending}</span>}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/5 flex-shrink-0">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center font-semibold text-sm">AD</div>
                        <div className="flex-1"><p className="text-sm font-medium">Admin</p><p className="text-xs text-white/40">admin@service.app</p></div>
                    </div>
                </div>
            </aside>

            {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

            {/* Main Content Area */}
            <main className="flex-1 h-screen overflow-y-auto relative flex flex-col w-full min-w-0 bg-transparent z-10">
                <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between w-full flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2.5 text-white/60 bg-white/5 rounded-xl"><Menu className="h-5 w-5" /></button>
                        <div><h1 className="text-xl font-bold capitalize">{activeTab}</h1></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={exportCSV} className="hidden sm:flex bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0"><Download className="h-4 w-4 mr-2" />Export</Button>
                    </div>
                </header>

                <div className="flex-1 p-6 w-full">
                    {activeTab === "dashboard" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                {[
                                    { label: "Total Requests", value: stats.total, change: "+12%", up: true, icon: ClipboardList, gradient: "from-blue-500 to-indigo-500" },
                                    { label: "Pending", value: stats.pending, change: stats.pending > 0 ? "Action needed" : "All clear", up: stats.pending === 0, icon: Clock, gradient: "from-amber-500 to-orange-500" },
                                    { label: "In Progress", value: stats.inProgress, change: "+8%", up: true, icon: Activity, gradient: "from-emerald-500 to-teal-500" },
                                    { label: "Revenue", value: `AED ${stats.revenue.toLocaleString()}`, change: "+24%", up: true, icon: DollarSign, gradient: "from-green-500 to-emerald-500" },
                                ].map((stat, i) => (
                                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                        <CardWrapper>
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", stat.gradient)}><stat.icon className="h-5 w-5" /></div>
                                                <span className={cn("flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full", stat.up ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10")}>{stat.up ? <ArrowUpRight className="h-3 w-3" /> : <Clock className="h-3 w-3" />}{stat.change}</span>
                                            </div>
                                            <p className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</p>
                                            <p className="text-sm text-white/40">{stat.label}</p>
                                        </CardWrapper>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <CardWrapper>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold">Recent Requests</h3>
                                        <button onClick={() => setActiveTab("requests")} className="text-sm text-emerald-400 flex items-center gap-1">View all <ChevronRight className="h-4 w-4" /></button>
                                    </div>
                                    <div className="space-y-3">
                                        {requests.slice(0, 5).map((r) => (
                                            <div key={r.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors w-full" onClick={() => handleEditRequest(r)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-medium text-sm">{r.userName?.substring(0, 2).toUpperCase()}</div>
                                                    <div><p className="font-medium">{r.userName}</p><p className="text-sm text-white/40">{r.service}</p></div>
                                                </div>
                                                <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusConfig[r.status]?.bg, statusConfig[r.status]?.color)}>{statusConfig[r.status]?.label}</span>
                                            </div>
                                        ))}
                                        {requests.length === 0 && <p className="text-center text-white/40 py-8">No requests yet</p>}
                                    </div>
                                </CardWrapper>
                                <CardWrapper>
                                    <h3 className="text-lg font-semibold mb-6">Quick Stats</h3>
                                    <div className="space-y-4">
                                        {[{ l: "Active Staff", v: mockStaff.filter(s => s.status === "active").length }, { l: "Avg. Rating", v: 4.8 }, { l: "Jobs Done", v: 152 }].map((x, i) => (
                                            <div key={i} className="flex justify-between p-4 bg-white/5 rounded-xl"><span className="text-white/60">{x.l}</span><span className="font-bold">{x.v}</span></div>
                                        ))}
                                    </div>
                                </CardWrapper>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "requests" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                                    <input type="text" placeholder="Search requests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-[#12121a]/60 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50" />
                                </div>
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-48 px-4 py-3 bg-[#12121a]/60 border border-white/10 rounded-xl text-sm text-white bg-transparent focus:outline-none focus:border-emerald-500/50">
                                    <option value="all">All Status</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="in-progress">In Progress</option><option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                {loading ? <div className="col-span-full text-center py-12"><RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-400" /><p>Loading...</p></div> :
                                    filteredRequests.map((r) => (
                                        <div key={r.id} className="bg-[#12121a]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6 hover:border-white/20 transition-all cursor-pointer group flex flex-col justify-between" onClick={() => handleEditRequest(r)}>
                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-bold mb-3">{r.userName?.substring(0, 2).toUpperCase()}</div>
                                                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1", statusConfig[r.status]?.bg, statusConfig[r.status]?.color)}>
                                                        {React.createElement(statusConfig[r.status]?.icon || Clock, { className: "h-3 w-3" })} {statusConfig[r.status]?.label}
                                                    </span>
                                                </div>
                                                <div className="mb-4">
                                                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{r.userName}</h3>
                                                    <p className="text-sm text-white/40 line-clamp-1">{r.service}</p>
                                                </div>
                                                <div className="space-y-2 text-sm text-white/60 bg-white/5 p-3 rounded-xl mb-4">
                                                    <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 flex-shrink-0" /> <span className="truncate">{r.scheduledDate}</span></div>
                                                    <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 flex-shrink-0" /> <span className="truncate">{r.scheduledTime}</span></div>
                                                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 flex-shrink-0" /> <span className="truncate">{r.address}</span></div>
                                                </div>
                                            </div>
                                            {(r.technician || r.estimatedCost) && (
                                                <div className="pt-4 border-t border-white/5 flex flex-col gap-2 text-sm">
                                                    {r.technician && <span className="text-emerald-400 flex items-center gap-2"><UserCheck className="h-4 w-4" /> {r.technician.name}</span>}
                                                    {r.estimatedCost && <span className="text-amber-400 flex items-center gap-2"><DollarSign className="h-4 w-4" /> AED {r.estimatedCost}</span>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "staff" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 w-full">
                            <div className="flex justify-between items-center w-full">
                                <div><h2 className="text-xl font-bold text-white">Team Members</h2><p className="text-sm text-white/40">{mockStaff.length} staff members</p></div>
                                <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0"><Plus className="h-4 w-4 mr-2" />Add Staff</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                {mockStaff.map(s => (
                                    <CardWrapper key={s.id}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">{s.name.substring(0, 2)}</div>
                                                <div><h3 className="font-bold">{s.name}</h3><p className="text-sm text-white/40">{s.role}</p></div>
                                            </div>
                                            <span className={cn("px-2 py-0.5 rounded text-xs", s.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/10 text-white/40")}>{s.status}</span>
                                        </div>
                                        <div className="space-y-2 text-sm text-white/60">
                                            <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {s.phone}</p>
                                            <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {s.email}</p>
                                        </div>
                                    </CardWrapper>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "analytics" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-[#12121a]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-6 w-full shadow-lg h-32 flex flex-col items-center justify-center text-center">
                                        <BarChart3 className="h-8 w-8 text-white/20 mb-2" />
                                        <p className="font-semibold">Metric {i}</p>
                                        <p className="text-sm text-white/40">Coming Soon</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "settings" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                {[
                                    { title: "General", icon: Settings, items: [{ label: "Business Name", value: "ServiceApp", type: "text" }, { label: "Contact Email", value: "admin@service.app", type: "email" }] },
                                    { title: "Notifications", icon: BellIcon, items: [{ label: "Email Notifications", value: true, type: "toggle" }, { label: "SMS Alerts", value: true, type: "toggle" }] },
                                    { title: "Security", icon: Shield, items: [{ label: "Two-Factor Auth", value: false, type: "toggle" }, { label: "Session Timeout", value: "30 mins", type: "select" }] },
                                ].map((section, i) => (
                                    <CardWrapper key={i}>
                                        <div className="flex items-center gap-3 mb-6"><div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center text-emerald-400"><section.icon className="h-5 w-5" /></div><h3 className="text-lg font-semibold text-white">{section.title}</h3></div>
                                        <div className="space-y-4">
                                            {section.items.map((item) => (
                                                <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                                    <span className="text-white/60">{item.label}</span>
                                                    <span className="text-white">{item.value.toString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardWrapper>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Modal */}
            <AnimatePresence>
                {editingRequest && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1a1a24] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Manage Request</h2>
                                <button onClick={() => setEditingRequest(null)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Customer Issue */}
                                {editingRequest.description && (
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <label className="text-xs font-semibold text-white/40 uppercase mb-2 block flex items-center gap-2">
                                            <MessageSquare className="h-3 w-3" /> Customer Issue
                                        </label>
                                        <p className="text-sm text-white/80 italic">"{editingRequest.description}"</p>
                                    </div>
                                )}

                                {/* Status */}
                                <div>
                                    <label className="text-xs font-semibold text-white/40 uppercase mb-2 block">Status</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(statusConfig).map(([key, val]) => (
                                            <button key={key} onClick={() => updateStatus(editingRequest.id, key)}
                                                className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                                                    editingRequest.status === key ? `${val.bg} ${val.color} border-current` : "border-white/10 text-white/40 hover:bg-white/5")}>
                                                {val.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Technician */}
                                <div>
                                    <label className="text-xs font-semibold text-white/40 uppercase mb-2 block">Assign Technician</label>
                                    <select value={tempTechId} onChange={(e) => setTempTechId(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50">
                                        <option value="">Select Technician...</option>
                                        {mockStaff.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
                                    </select>
                                </div>

                                {/* Cost & Notes */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-white/40 uppercase mb-2 block">Est. Cost (AED)</label>
                                        <input type="number" value={tempCost} onChange={(e) => setTempCost(e.target.value)} placeholder="0.00"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-white/40 uppercase mb-2 block">Admin Notes</label>
                                    <textarea value={tempNotes} onChange={(e) => setTempNotes(e.target.value)} rows={3} placeholder="Add notes for the customer..."
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 resize-none" />
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/10 flex gap-3">
                                <Button onClick={saveRequestDetails} className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 hover:from-emerald-600 hover:to-cyan-600">Save Changes</Button>
                                <Button onClick={() => setEditingRequest(null)} variant="outline" className="border-white/10 text-white hover:bg-white/5">Cancel</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
