"use client"

import { useState, useEffect } from "react"
import {
    Cpu, Activity, AlertTriangle, CheckCircle, Settings,
    Wifi, WifiOff, Gauge, Thermometer, Zap, Clock,
    TrendingUp, BarChart3, RefreshCw
} from "lucide-react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"

// Mock machine data
const mockMachines = [
    {
        id: 1,
        code: "CNC-001",
        name: "CNC Lathe #1",
        type: "CNC",
        line: "Line 1",
        status: "Running",
        iotEnabled: true,
        oee: 87.5,
        currentPart: "BD-001",
        cycleCount: 1245,
        temperature: 42,
        power: 75
    },
    {
        id: 2,
        code: "PRESS-001",
        name: "Hydraulic Press #1",
        type: "Press",
        line: "Line 2",
        status: "Running",
        iotEnabled: true,
        oee: 92.3,
        currentPart: "EM-045",
        cycleCount: 856,
        temperature: 38,
        power: 68
    },
    {
        id: 3,
        code: "CNC-002",
        name: "CNC Milling #1",
        type: "CNC",
        line: "Line 1",
        status: "Maintenance",
        iotEnabled: true,
        oee: 0,
        currentPart: null,
        cycleCount: 0,
        temperature: 25,
        power: 5
    },
    {
        id: 4,
        code: "WELD-001",
        name: "Welding Robot #1",
        type: "Welding",
        line: "Line 3",
        status: "Idle",
        iotEnabled: false,
        oee: 78.2,
        currentPart: null,
        cycleCount: 0,
        temperature: 28,
        power: 10
    },
]

// Mock alarms
const mockAlarms = [
    { id: 1, machine: "CNC-001", message: "Spindle temperature warning", severity: "Warning", time: "2 min ago" },
    { id: 2, machine: "PRESS-001", message: "Oil pressure low", severity: "Critical", time: "15 min ago" },
]

export default function MachinesPage() {
    const [activeTab, setActiveTab] = useState<"machines" | "alarms" | "maintenance">("machines")
    const [refreshing, setRefreshing] = useState(false)

    const handleRefresh = () => {
        setRefreshing(true)
        setTimeout(() => setRefreshing(false), 1000)
    }

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                            Machines & IoT Monitoring
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            Real-time machine monitoring and predictive maintenance
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Activity className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">8</p>
                                <p className="text-xs text-[var(--text-muted)]">Running</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">3</p>
                                <p className="text-xs text-[var(--text-muted)]">Idle</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Settings className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">2</p>
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
                                <p className="text-2xl font-bold text-[var(--text-primary)]">2</p>
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
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        Machines
                    </button>
                    <button
                        onClick={() => setActiveTab("alarms")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "alarms"
                                ? "border-red-600 text-red-600"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        Alarms
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">2</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("maintenance")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "maintenance"
                                ? "border-orange-600 text-orange-600"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        Maintenance
                    </button>
                </div>

                {/* Machines Grid */}
                {activeTab === "machines" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mockMachines.map((machine, index) => (
                            <motion.div
                                key={machine.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors cursor-pointer">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-[var(--text-primary)]">{machine.name}</h3>
                                                {machine.iotEnabled ? (
                                                    <Wifi className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <WifiOff className="w-4 h-4 text-gray-400" />
                                                )}
                                            </div>
                                            <p className="text-xs text-[var(--text-muted)]">{machine.code} • {machine.line}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${machine.status === "Running"
                                                ? "bg-green-100 text-green-700"
                                                : machine.status === "Maintenance"
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "bg-gray-100 text-gray-700"
                                            }`}>
                                            {machine.status}
                                        </span>
                                    </div>

                                    {/* OEE Gauge */}
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="relative w-24 h-24">
                                            <svg className="w-24 h-24 transform -rotate-90">
                                                <circle
                                                    cx="48"
                                                    cy="48"
                                                    r="40"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    className="text-[var(--bg-tertiary)]"
                                                />
                                                <circle
                                                    cx="48"
                                                    cy="48"
                                                    r="40"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeDasharray={`${machine.oee * 2.51} 251`}
                                                    className={machine.oee >= 85 ? "text-green-500" : machine.oee >= 70 ? "text-yellow-500" : "text-red-500"}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-lg font-bold">{machine.oee}%</span>
                                                <span className="text-[10px] text-[var(--text-muted)]">OEE</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real-time metrics */}
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg">
                                            <div className="flex items-center justify-center gap-1 text-[var(--text-muted)]">
                                                <Thermometer className="w-3 h-3" />
                                            </div>
                                            <p className="text-sm font-medium">{machine.temperature}°C</p>
                                        </div>
                                        <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg">
                                            <div className="flex items-center justify-center gap-1 text-[var(--text-muted)]">
                                                <Zap className="w-3 h-3" />
                                            </div>
                                            <p className="text-sm font-medium">{machine.power}%</p>
                                        </div>
                                        <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg">
                                            <div className="flex items-center justify-center gap-1 text-[var(--text-muted)]">
                                                <TrendingUp className="w-3 h-3" />
                                            </div>
                                            <p className="text-sm font-medium">{machine.cycleCount}</p>
                                        </div>
                                    </div>

                                    {machine.currentPart && (
                                        <div className="mt-3 p-2 bg-emerald-50 rounded-lg text-center">
                                            <p className="text-xs text-emerald-700">
                                                Running: <span className="font-medium">{machine.currentPart}</span>
                                            </p>
                                        </div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Active Alarms */}
                {activeTab === "alarms" && (
                    <div className="space-y-3">
                        {mockAlarms.map((alarm, index) => (
                            <motion.div
                                key={alarm.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className={`p-4 border-l-4 ${alarm.severity === "Critical" ? "border-l-red-500" : "border-l-yellow-500"
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${alarm.severity === "Critical" ? "bg-red-100" : "bg-yellow-100"
                                                }`}>
                                                <AlertTriangle className={`w-5 h-5 ${alarm.severity === "Critical" ? "text-red-600" : "text-yellow-600"
                                                    }`} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--text-primary)]">{alarm.message}</p>
                                                <p className="text-sm text-[var(--text-muted)]">
                                                    Machine: {alarm.machine} • {alarm.time}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1 text-sm bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded transition-colors">
                                            Acknowledge
                                        </button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Maintenance Schedule */}
                {activeTab === "maintenance" && (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Maintenance schedule coming soon</p>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
