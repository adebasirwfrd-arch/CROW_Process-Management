"use client"

import { useState } from "react"
import {
    AlertTriangle, Plus, Search, FileWarning,
    CheckCircle, Clock, Loader2, FileText
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"
import { useNCRs, useNCRStats, useCAPAs } from "@/hooks/useNCR"

export default function NCRPage() {
    const [activeTab, setActiveTab] = useState<"ncr" | "capa">("ncr")
    const [filterStatus, setFilterStatus] = useState("All")

    // Real data from Supabase
    const { data: ncrs, isLoading: ncrLoading } = useNCRs({
        status: filterStatus !== 'All' ? filterStatus : undefined
    })
    const { data: stats } = useNCRStats()
    const { data: capas, isLoading: capaLoading } = useCAPAs()

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                            NCR & CAPA Management
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            ISO 9001:2015 - Clause 10.2 Nonconformity & Corrective Action
                        </p>
                    </div>
                    <Link href="/ncr/new" className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Raise NCR</span>
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600">{stats?.open ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Open NCRs</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">{stats?.underInvestigation ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Under Investigation</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{stats?.closed ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Closed</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.total ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Total NCRs</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-[var(--border-light)]">
                    <button
                        onClick={() => setActiveTab("ncr")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "ncr"
                                ? "border-red-600 text-red-600"
                                : "border-transparent text-[var(--text-muted)]"
                            }`}
                    >
                        NCR Reports
                    </button>
                    <button
                        onClick={() => setActiveTab("capa")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "capa"
                                ? "border-red-600 text-red-600"
                                : "border-transparent text-[var(--text-muted)]"
                            }`}
                    >
                        CAPA Actions
                    </button>
                </div>

                {/* Filter */}
                {activeTab === "ncr" && (
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm"
                    >
                        <option value="All">All Status</option>
                        <option value="open">Open</option>
                        <option value="under_investigation">Under Investigation</option>
                        <option value="pending_disposition">Pending Disposition</option>
                        <option value="closed">Closed</option>
                    </select>
                )}

                {/* Loading State */}
                {(ncrLoading && activeTab === "ncr") || (capaLoading && activeTab === "capa") && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                    </div>
                )}

                {/* NCR List */}
                {activeTab === "ncr" && !ncrLoading && (
                    <div className="space-y-3">
                        {ncrs?.length === 0 ? (
                            <div className="text-center py-12 text-[var(--text-muted)]">
                                <FileWarning className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No NCRs found</p>
                            </div>
                        ) : (
                            ncrs?.map((ncr, index) => (
                                <motion.div
                                    key={ncr.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link href={`/ncr/${ncr.id}`}>
                                        <GlassCard className="p-4 hover:border-red-500/50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ncr.status === "closed"
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-red-100 text-red-600"
                                                        }`}>
                                                        <AlertTriangle className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-[var(--text-primary)]">
                                                            {ncr.ncr_number}
                                                        </h3>
                                                        <p className="text-sm text-[var(--text-muted)] line-clamp-1">
                                                            {ncr.defect_description}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                                                            <span className="capitalize">{ncr.source?.replace('_', ' ')}</span>
                                                            {ncr.part && <span>• {ncr.part.part_number}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${ncr.status === "open" ? "bg-red-100 text-red-700" :
                                                            ncr.status === "closed" ? "bg-green-100 text-green-700" :
                                                                "bg-yellow-100 text-yellow-700"
                                                        }`}>
                                                        {ncr.status?.replace('_', ' ')}
                                                    </span>
                                                    <p className="text-xs text-[var(--text-muted)] mt-1">
                                                        Qty: {ncr.defect_quantity}
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

                {/* CAPA List */}
                {activeTab === "capa" && !capaLoading && (
                    <div className="space-y-3">
                        {capas?.length === 0 ? (
                            <div className="text-center py-12 text-[var(--text-muted)]">
                                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No CAPA actions found</p>
                            </div>
                        ) : (
                            capas?.map((capa, index) => (
                                <motion.div
                                    key={capa.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <GlassCard className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                                        {capa.capa_number}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${capa.capa_type === "corrective"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-purple-100 text-purple-700"
                                                        }`}>
                                                        {capa.capa_type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
                                                    {capa.problem_statement}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${capa.status === "closed" ? "bg-green-100 text-green-700" :
                                                    capa.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                                                        "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                {capa.status?.replace('_', ' ')}
                                            </span>
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
