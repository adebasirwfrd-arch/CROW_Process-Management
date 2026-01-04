"use client"

import { useState } from "react"
import {
    CheckCircle2, XCircle, AlertTriangle, Clipboard,
    Search, Filter, Plus, BarChart3, TrendingDown,
    ClipboardCheck, Eye
} from "lucide-react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"

// Mock QC Inspection data
const mockInspections = [
    {
        id: 1,
        inspectionNumber: "QC-2026-001",
        checkpoint: "Final Inspection",
        partName: "Brake Disc Assembly",
        lotNumber: "LOT-20260104-001",
        inspector: "John Doe",
        date: "2026-01-04",
        sampleSize: 50,
        passed: 48,
        failed: 2,
        result: "Passed"
    },
    {
        id: 2,
        inspectionNumber: "QC-2026-002",
        checkpoint: "In-Process",
        partName: "Engine Mount Bracket",
        lotNumber: "LOT-20260104-002",
        inspector: "Jane Smith",
        date: "2026-01-04",
        sampleSize: 30,
        passed: 30,
        failed: 0,
        result: "Passed"
    },
    {
        id: 3,
        inspectionNumber: "QC-2026-003",
        checkpoint: "Incoming",
        partName: "Steel Sheet 3mm",
        lotNumber: "LOT-20260103-005",
        inspector: "Bob Johnson",
        date: "2026-01-03",
        sampleSize: 20,
        passed: 15,
        failed: 5,
        result: "Failed"
    },
]

export default function QualityPage() {
    const [activeTab, setActiveTab] = useState<"inspections" | "checkpoints">("inspections")

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                            Quality Control
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            ISO 9001:2015 - Clause 8.6 Release of Products and Services
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>New Inspection</span>
                    </button>
                </div>

                {/* Quality KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">98.5%</p>
                                <p className="text-xs text-[var(--text-muted)]">First Pass Yield</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingDown className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">320</p>
                                <p className="text-xs text-[var(--text-muted)]">Defect PPM</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">156</p>
                                <p className="text-xs text-[var(--text-muted)]">Inspections MTD</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">8</p>
                                <p className="text-xs text-[var(--text-muted)]">Failed Lots</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-[var(--border-light)]">
                    <button
                        onClick={() => setActiveTab("inspections")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "inspections"
                                ? "border-emerald-600 text-emerald-600"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        Inspection Records
                    </button>
                    <button
                        onClick={() => setActiveTab("checkpoints")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "checkpoints"
                                ? "border-emerald-600 text-emerald-600"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        QC Checkpoints
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search inspections..."
                            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select
                        className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="All">All Results</option>
                        <option value="Passed">Passed</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>

                {/* Inspections List */}
                {activeTab === "inspections" && (
                    <div className="space-y-3">
                        {mockInspections.map((inspection, index) => (
                            <motion.div
                                key={inspection.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${inspection.result === "Passed"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                                }`}>
                                                {inspection.result === "Passed" ? (
                                                    <CheckCircle2 className="w-6 h-6" />
                                                ) : (
                                                    <XCircle className="w-6 h-6" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                                        {inspection.inspectionNumber}
                                                    </h3>
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-[var(--bg-tertiary)] rounded">
                                                        {inspection.checkpoint}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[var(--text-muted)]">
                                                    {inspection.partName} • {inspection.lotNumber}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                                                    <span>Inspector: {inspection.inspector}</span>
                                                    <span>Date: {inspection.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-green-600">{inspection.passed}</p>
                                                <p className="text-xs text-[var(--text-muted)]">Passed</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-lg font-bold text-red-600">{inspection.failed}</p>
                                                <p className="text-xs text-[var(--text-muted)]">Failed</p>
                                            </div>
                                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${inspection.result === "Passed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                {inspection.result}
                                            </span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* QC Checkpoints */}
                {activeTab === "checkpoints" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {["Incoming Inspection", "Machining QC", "Assembly QC", "Paint QC", "Final Inspection", "Packing QC"].map((checkpoint, index) => (
                            <motion.div
                                key={checkpoint}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="p-4 cursor-pointer hover:border-emerald-500/50 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-[var(--text-primary)]">{checkpoint}</h3>
                                        <Eye className="w-4 h-4 text-[var(--text-muted)]" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--text-muted)]">Type</span>
                                            <span className="font-medium">Visual + Dimensional</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--text-muted)]">Sampling</span>
                                            <span className="font-medium">AQL 2.5, Level II</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[var(--text-muted)]">Criteria</span>
                                            <span className="font-medium">{5 + index} items</span>
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
