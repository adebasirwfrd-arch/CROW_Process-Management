"use client"

import { useState } from "react"
import {
    Factory, Plus, Play, Pause, Clock,
    CheckCircle, Gauge, Timer, Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"
import { useProductionOrders, useProductionStats, useProductionLines } from "@/hooks/useProductionOrders"

export default function ProductionPage() {
    const [activeTab, setActiveTab] = useState<"orders" | "lines">("orders")
    const [filterStatus, setFilterStatus] = useState("All")

    // Real data from Supabase
    const { data: orders, isLoading, error } = useProductionOrders({
        status: filterStatus !== 'All' ? filterStatus : undefined
    })
    const { data: stats } = useProductionStats()
    const { data: lines } = useProductionLines()

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
                    <Link href="/production/new" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>New Production Order</span>
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Factory className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.activeOrders ?? '-'}</p>
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
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.fpy ?? '-'}%</p>
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
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.pendingOrders ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Pending</p>
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

                {/* Loading State */}
                {isLoading && activeTab === "orders" && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                )}

                {/* Error State */}
                {error && activeTab === "orders" && (
                    <div className="text-center py-12 text-red-500">
                        <p>Failed to load production orders. Please apply database migrations first.</p>
                    </div>
                )}

                {/* Production Orders List */}
                {activeTab === "orders" && !isLoading && !error && (
                    <div className="space-y-3">
                        {orders?.length === 0 ? (
                            <div className="text-center py-12 text-[var(--text-muted)]">
                                <Factory className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No production orders found</p>
                                <Link href="/production/new" className="text-emerald-600 hover:underline mt-2 inline-block">
                                    Create your first order
                                </Link>
                            </div>
                        ) : (
                            orders?.map((order, index) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link href={`/production/${order.id}`}>
                                        <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors">
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${order.status === "in_progress"
                                                            ? "bg-blue-100 text-blue-600"
                                                            : order.status === "completed"
                                                                ? "bg-green-100 text-green-600"
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}>
                                                        {order.status === "in_progress" ? (
                                                            <Play className="w-6 h-6" />
                                                        ) : order.status === "completed" ? (
                                                            <CheckCircle className="w-6 h-6" />
                                                        ) : (
                                                            <Pause className="w-6 h-6" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="font-semibold text-[var(--text-primary)]">
                                                                {order.order_number}
                                                            </h3>
                                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${order.priority === "high" || order.priority === "urgent"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-gray-100 text-gray-700"
                                                                }`}>
                                                                {order.priority}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-[var(--text-muted)]">
                                                            {order.part?.name} ({order.part?.part_number})
                                                        </p>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                                                            {order.production_line && (
                                                                <span className="flex items-center gap-1">
                                                                    <Factory className="w-3 h-3" />
                                                                    {order.production_line.name}
                                                                </span>
                                                            )}
                                                            {order.planned_end && (
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    Due: {new Date(order.planned_end).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${order.status === "in_progress"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : order.status === "completed"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}>
                                                        {order.status?.replace('_', ' ')}
                                                    </span>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-[var(--text-primary)]">
                                                            {order.quantity_completed}/{order.quantity_ordered}
                                                        </p>
                                                        <div className="w-32 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-emerald-500 rounded-full"
                                                                style={{ width: `${(order.quantity_completed / order.quantity_ordered) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {/* Production Lines */}
                {activeTab === "lines" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lines?.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-[var(--text-muted)]">
                                <Factory className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No production lines configured</p>
                            </div>
                        ) : (
                            lines?.map((line: any, index: number) => (
                                <motion.div
                                    key={line.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <GlassCard className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-[var(--text-primary)]">{line.name}</h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${line.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                {line.status}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--text-muted)]">Code</span>
                                                <span className="font-medium">{line.code}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[var(--text-muted)]">Capacity</span>
                                                <span className="font-medium">{line.capacity_per_hour || '-'}/hr</span>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
