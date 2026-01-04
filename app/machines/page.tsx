"use client"

import { useState } from "react"
import {
    Cpu, Plus, Search, Gauge, Activity,
    AlertTriangle, CheckCircle, Wrench, Loader2, Bell
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"
import { useMachines, useMachineStats, useActiveAlarms } from "@/hooks/useMachines"

export default function MachinesPage() {
    const [activeTab, setActiveTab] = useState<"machines" | "alarms" | "maintenance">("machines")
    const [filterStatus, setFilterStatus] = useState("All")

    // Real data from Supabase
    const { data: machines, isLoading } = useMachines({
        status: filterStatus !== 'All' ? filterStatus : undefined
    })
    const { data: stats } = useMachineStats()
    const { data: alarms } = useActiveAlarms()

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'running': return 'bg-green-100 text-green-700'
            case 'idle': return 'bg-blue-100 text-blue-700'
            case 'maintenance': return 'bg-yellow-100 text-yellow-700'
            case 'breakdown': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                            Machines & IoT
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            Real-time equipment monitoring
                        </p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Gauge className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.oee ?? '-'}%</p>
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
                                <p className="text-2xl font-bold text-green-600">{stats?.running ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Running</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Wrench className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">{stats?.maintenance ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Maintenance</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600">{stats?.activeAlarms ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Active Alarms</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-[var(--border-light)]">
                    <button
                        onClick={() => setActiveTab("machines")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "machines"
                                ? "border-emerald-600 text-emerald-600"
                                : "border-transparent text-[var(--text-muted)]"
                            }`}
                    >
                        Machines
                    </button>
                    <button
                        onClick={() => setActiveTab("alarms")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "alarms"
                                ? "border-emerald-600 text-emerald-600"
                                : "border-transparent text-[var(--text-muted)]"
                            }`}
                    >
                        Alarms
                        {(stats?.activeAlarms ?? 0) > 0 && (
                            <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                {stats?.activeAlarms}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("maintenance")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "maintenance"
                                ? "border-emerald-600 text-emerald-600"
                                : "border-transparent text-[var(--text-muted)]"
                            }`}
                    >
                        Maintenance
                    </button>
                </div>

                {/* Filter */}
                {activeTab === "machines" && (
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm"
                    >
                        <option value="All">All Status</option>
                        <option value="running">Running</option>
                        <option value="idle">Idle</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="breakdown">Breakdown</option>
                    </select>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                )}

                {/* Machines Grid */}
                {activeTab === "machines" && !isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {machines?.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-[var(--text-muted)]">
                                <Cpu className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No machines configured</p>
                            </div>
                        ) : (
                            machines?.map((machine, index) => (
                                <motion.div
                                    key={machine.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link href={`/machines/${machine.id}`}>
                                        <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${machine.status === 'running' ? 'bg-green-500 animate-pulse' :
                                                            machine.status === 'breakdown' ? 'bg-red-500' :
                                                                'bg-gray-400'
                                                        }`} />
                                                    <span className="font-mono text-sm text-[var(--text-muted)]">{machine.code}</span>
                                                </div>
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getStatusColor(machine.status)}`}>
                                                    {machine.status}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-[var(--text-primary)]">{machine.name}</h3>
                                            <p className="text-sm text-[var(--text-muted)]">
                                                {machine.machine_type || 'General'}
                                            </p>
                                            <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)]">
                                                {machine.production_line && (
                                                    <span>Line: {machine.production_line.name}</span>
                                                )}
                                                {machine.iot_enabled && (
                                                    <span className="flex items-center gap-1 text-blue-600">
                                                        <Activity className="w-3 h-3" />
                                                        IoT
                                                    </span>
                                                )}
                                            </div>
                                        </GlassCard>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {/* Alarms List */}
                {activeTab === "alarms" && (
                    <div className="space-y-3">
                        {alarms?.length === 0 ? (
                            <div className="text-center py-12 text-[var(--text-muted)]">
                                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No active alarms</p>
                            </div>
                        ) : (
                            alarms?.map((alarm: any, index: number) => (
                                <motion.div
                                    key={alarm.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <GlassCard className={`p-4 border-l-4 ${alarm.alarm_type === 'critical' ? 'border-l-red-500' :
                                            alarm.alarm_type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle className={`w-4 h-4 ${alarm.alarm_type === 'critical' ? 'text-red-600' :
                                                            alarm.alarm_type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                                                        }`} />
                                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                                        {alarm.machine?.name}
                                                    </h3>
                                                </div>
                                                <p className="text-sm text-[var(--text-muted)] mt-1">{alarm.message}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${alarm.alarm_type === 'critical' ? 'bg-red-100 text-red-700' :
                                                    alarm.alarm_type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {alarm.alarm_type}
                                            </span>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {/* Maintenance Tab Placeholder */}
                {activeTab === "maintenance" && (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Maintenance schedule coming soon</p>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
