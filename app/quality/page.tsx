"use client"

import { useState } from "react"
import {
    CheckCircle2, Search, AlertCircle, TrendingUp,
    Loader2, Plus, BarChart, XCircle
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"
import { useQCInspections, useQCStats, useQCCheckpoints } from "@/hooks/useQCInspections"

export default function QualityPage() {
    const [activeTab, setActiveTab] = useState<"inspections" | "checkpoints">("inspections")
    const [filterResult, setFilterResult] = useState("All")

    // Real data from Supabase
    const { data: inspections, isLoading, error } = useQCInspections({
        result: filterResult !== 'All' ? filterResult : undefined
    })
    const { data: stats } = useQCStats()
    const { data: checkpoints } = useQCCheckpoints()

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
                            ISO 9001:2015 - Clause 8.6 Release of Products & Services
                        </p>
                    </div>
                    <Link href="/quality/new" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>New Inspection</span>
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.fpy ?? '-'}%</p>
                                <p className="text-xs text-[var(--text-muted)]">First Pass Yield</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.ppm ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Defect PPM</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{stats?.passed ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Passed</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600">{stats?.failed ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Failed</p>
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
                                : "border-transparent text-[var(--text-muted)]"
                            }`}
                    >
                        Inspections
                    </button>
                    <button
                        onClick={() => setActiveTab("checkpoints")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "checkpoints"
                                ? "border-emerald-600 text-emerald-600"
                                : "border-transparent text-[var(--text-muted)]"
                            }`}
                    >
                        QC Checkpoints
                    </button>
                </div>

                {/* Filter */}
                {activeTab === "inspections" && (
                    <div className="flex gap-3">
                        <select
                            value={filterResult}
                            onChange={(e) => setFilterResult(e.target.value)}
                            className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm"
                        >
                            <option value="All">All Results</option>
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                            <option value="conditional">Conditional</option>
                        </select>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && activeTab === "inspections" && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                )}

                {/* Inspections List */}
                {activeTab === "inspections" && !isLoading && (
                    <div className="space-y-3">
                        {inspections?.length === 0 ? (
                            <div className="text-center py-12 text-[var(--text-muted)]">
                                <BarChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No inspections found</p>
                                <Link href="/quality/new" className="text-emerald-600 hover:underline mt-2 inline-block">
                                    Record your first inspection
                                </Link>
                            </div>
                        ) : (
                            inspections?.map((inspection, index) => (
                                <motion.div
                                    key={inspection.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link href={`/quality/${inspection.id}`}>
                                        <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${inspection.result === "passed"
                                                            ? "bg-green-100 text-green-600"
                                                            : inspection.result === "failed"
                                                                ? "bg-red-100 text-red-600"
                                                                : "bg-yellow-100 text-yellow-600"
                                                        }`}>
                                                        {inspection.result === "passed" ? (
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        ) : (
                                                            <AlertCircle className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-[var(--text-primary)]">
                                                            {inspection.inspection_number}
                                                        </h3>
                                                        <p className="text-sm text-[var(--text-muted)]">
                                                            {inspection.part?.name} • Lot: {inspection.lot_number || '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${inspection.result === "passed"
                                                            ? "bg-green-100 text-green-700"
                                                            : inspection.result === "failed"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}>
                                                        {inspection.result}
                                                    </span>
                                                    <p className="text-xs text-[var(--text-muted)] mt-1">
                                                        {inspection.accepted_qty}/{inspection.sample_size} accepted
                                                    </p>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {/* Checkpoints List */}
                {activeTab === "checkpoints" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {checkpoints?.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-[var(--text-muted)]">
                                <p>No QC checkpoints configured</p>
                            </div>
                        ) : (
                            checkpoints?.map((cp: any, index: number) => (
                                <motion.div
                                    key={cp.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <GlassCard className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full capitalize">
                                                {cp.checkpoint_type?.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs text-[var(--text-muted)]">#{cp.sequence_order}</span>
                                        </div>
                                        <h3 className="font-semibold text-[var(--text-primary)]">{cp.name}</h3>
                                        <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">{cp.description}</p>
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
