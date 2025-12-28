"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "pending" | "in-progress" | "completed";

interface ActivityItem {
    id: string;
    service: string;
    date: string;
    status: Status;
}

const mockActivity: ActivityItem[] = [
    { id: "REQ-2024-001", service: "AC Maintenance", date: "Today, 10:00 AM", status: "in-progress" },
    { id: "REQ-2023-892", service: "Plumbing Repair", date: "Dec 12, 2024", status: "completed" },
    { id: "REQ-2023-845", service: "Electrical Inspection", date: "Nov 28, 2024", status: "pending" },
];

const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-200" },
    "in-progress": { label: "In Progress", icon: AlertCircle, color: "text-blue-600 bg-blue-50 border-blue-200" },
    completed: { label: "Completed", icon: CheckCircle2, color: "text-green-600 bg-green-50 border-green-200" },
};

export function RecentActivity() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-neutral-900">Recent Activity</h2>
                <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    View all
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                {mockActivity.length > 0 ? (
                    <div className="divide-y divide-neutral-100">
                        {mockActivity.map((item, index) => {
                            const StatusIcon = statusConfig[item.status].icon;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center border", statusConfig[item.status].color)}>
                                            <StatusIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-neutral-900 group-hover:text-primary transition-colors">{item.service}</h4>
                                            <p className="text-xs text-neutral-500">{item.id} • {item.date}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                            statusConfig[item.status].color
                                        )}>
                                            {statusConfig[item.status].label}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center text-neutral-500">
                        No recent activity found.
                    </div>
                )}
            </div>
        </div>
    );
}
