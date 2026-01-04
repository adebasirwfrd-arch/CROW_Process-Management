"use client"

import { useState } from "react"
import {
    Factory, Plus, Play, Pause, Clock, Package,
    TrendingUp, AlertTriangle, CheckCircle, BarChart3,
    Users, Gauge, Timer
} from "lucide-react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"

// Mock production data
const mockProductionOrders = [
    {
        id: 1,
        orderNumber: "PO-2026-001",
        partName: "Brake Disc Assembly",
        partNumber: "BD-001",
        quantity: 500,
        completed: 320,
        rejected: 5,
        status: "In Progress",
        priority: "High",
        dueDate: "2026-01-10",
        line: "Line 1"
    },
    {
        id: 2,
        orderNumber: "PO-2026-002",
        partName: "Engine Mount Bracket",
        partNumber: "EM-045",
        quantity: 200,
        completed: 200,
        rejected: 2,
        status: "Completed",
        priority: "Normal",
        dueDate: "2026-01-05",
        line: "Line 2"
    },
    {
        id: 3,
        orderNumber: "PO-2026-003",
        partName: "Exhaust Pipe Clamp",
        partNumber: "EP-012",
        quantity: 1000,
        completed: 0,
        rejected: 0,
        status: "Pending",
        priority: "Normal",
        dueDate: "2026-01-15",
        line: "Line 3"
    },
]

export default function ProductionPage() {
    const [activeTab, setActiveTab] = useState<"orders" | "lines">("orders")

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                            Production Management
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            ISO 9001:2015 - Clause 8.5 Production & Service Provision
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>New Production Order</span>
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Factory className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">12</p>
                                <p className="text-xs text-[var(--text-muted)]">Active Orders</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Gauge className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">87.5%</p>
                                <p className="text-xs text-[var(--text-muted)]">OEE Score</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">98.2%</p>
                                <p className="text-xs text-[var(--text-muted)]">First Pass Yield</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Timer className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">4.2s</p>
                                <p className="text-xs text-[var(--text-muted)]">Avg Cycle Time</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-[var(--border-light)]">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "orders"
                                ? "border-emerald-600 text-emerald-600"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        Production Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("lines")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "lines"
                                ? "border-emerald-600 text-emerald-600"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        Production Lines
                    </button>
                </div>

                {/* Production Orders List */}
                {activeTab === "orders" && (
                    <div className="space-y-3">
                        {mockProductionOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${order.status === "In Progress"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : order.status === "Completed"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}>
                                                {order.status === "In Progress" ? (
                                                    <Play className="w-6 h-6" />
                                                ) : order.status === "Completed" ? (
                                                    <CheckCircle className="w-6 h-6" />
                                                ) : (
                                                    <Pause className="w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                                        {order.orderNumber}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${order.priority === "High"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-700"
                                                        }`}>
                                                        {order.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[var(--text-muted)]">
                                                    {order.partName} ({order.partNumber})
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                                                    <span className="flex items-center gap-1">
                                                        <Factory className="w-3 h-3" />
                                                        {order.line}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        Due: {order.dueDate}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === "In Progress"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : order.status === "Completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}>
                                                {order.status}
                                            </span>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-[var(--text-primary)]">
                                                    {order.completed}/{order.quantity}
                                                </p>
                                                <div className="w-32 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500 rounded-full"
                                                        style={{ width: `${(order.completed / order.quantity) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Production Lines */}
                {activeTab === "lines" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {["Line 1", "Line 2", "Line 3", "Line 4"].map((line, index) => (
                            <motion.div
                                key={line}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-[var(--text-primary)]">{line}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${index !== 2
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {index !== 2 ? "Running" : "Idle"}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--text-muted)]">OEE</span>
                                            <span className="font-medium">{85 + index * 3}%</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--text-muted)]">Output Today</span>
                                            <span className="font-medium">{450 + index * 50} pcs</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--text-muted)]">Cycle Time</span>
                                            <span className="font-medium">{4.2 - index * 0.2}s</span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
