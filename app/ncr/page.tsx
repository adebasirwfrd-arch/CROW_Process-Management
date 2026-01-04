"use client"

import { useState } from "react"
import {
    AlertTriangle, Plus, Search, Clock, CheckCircle,
    FileWarning, Target, Users, ArrowRight, XCircle
} from "lucide-react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"

// Mock NCR data
const mockNCRs = [
    {
        id: 1,
        ncrNumber: "NCR-2026-001",
        source: "In-Process",
        partName: "Brake Disc Assembly",
        defect: "Dimensional out of tolerance",
        quantity: 12,
        status: "Open",
        rootCause: "Tool wear not detected",
        disposition: "Rework",
        detectedDate: "2026-01-04"
    },
    {
        id: 2,
        ncrNumber: "NCR-2026-002",
        source: "Final Inspection",
        partName: "Engine Mount",
        defect: "Surface scratches",
        quantity: 5,
        status: "Under Investigation",
        rootCause: "Pending analysis",
        disposition: "Pending",
        detectedDate: "2026-01-03"
    },
    {
        id: 3,
        ncrNumber: "NCR-2025-098",
        source: "Customer",
        partName: "Exhaust Clamp",
        defect: "Incorrect material",
        quantity: 50,
        status: "Closed",
        rootCause: "Supplier material mix-up",
        disposition: "Return to Supplier",
        detectedDate: "2025-12-28"
    },
]

const mockCAPAs = [
    {
        id: 1,
        capaNumber: "CAPA-2026-001",
        type: "Corrective",
        ncrRef: "NCR-2026-001",
        problem: "Tool wear causing dimensional defects",
        action: "Implement tool life monitoring system",
        status: "In Progress",
        targetDate: "2026-01-15",
        responsible: "John Doe"
    },
    {
        id: 2,
        capaNumber: "CAPA-2025-012",
        type: "Preventive",
        ncrRef: null,
        problem: "Potential contamination risk in assembly area",
        action: "Install air filtration system",
        status: "Completed",
        targetDate: "2025-12-30",
        responsible: "Jane Smith"
    },
]

export default function NCRPage() {
    const [activeTab, setActiveTab] = useState<"ncr" | "capa">("ncr")

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
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Raise NCR</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">8</p>
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
                                <p className="text-2xl font-bold text-[var(--text-primary)]">5</p>
                                <p className="text-xs text-[var(--text-muted)]">Under Investigation</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Target className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">12</p>
                                <p className="text-xs text-[var(--text-muted)]">Active CAPAs</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">92%</p>
                                <p className="text-xs text-[var(--text-muted)]">CAPA Effectiveness</p>
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
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        NCR Reports
                    </button>
                    <button
                        onClick={() => setActiveTab("capa")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "capa"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        CAPA Actions
                    </button>
                </div>

                {/* NCR List */}
                {activeTab === "ncr" && (
                    <div className="space-y-3">
                        {mockNCRs.map((ncr, index) => (
                            <motion.div
                                key={ncr.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="p-4 hover:border-red-500/50 transition-colors cursor-pointer">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${ncr.status === "Open"
                                                    ? "bg-red-100 text-red-600"
                                                    : ncr.status === "Closed"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-yellow-100 text-yellow-600"
                                                }`}>
                                                <FileWarning className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                                        {ncr.ncrNumber}
                                                    </h3>
                                                    <span className="px-2 py-0.5 text-xs font-medium bg-[var(--bg-tertiary)] rounded">
                                                        {ncr.source}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[var(--text-primary)] font-medium mt-1">
                                                    {ncr.partName}
                                                </p>
                                                <p className="text-sm text-[var(--text-muted)]">
                                                    {ncr.defect}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                                                    <span>Qty: {ncr.quantity}</span>
                                                    <span>Detected: {ncr.detectedDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${ncr.status === "Open"
                                                    ? "bg-red-100 text-red-700"
                                                    : ncr.status === "Closed"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                {ncr.status}
                                            </span>
                                            <span className="text-xs text-[var(--text-muted)]">
                                                Disposition: {ncr.disposition}
                                            </span>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* CAPA List */}
                {activeTab === "capa" && (
                    <div className="space-y-3">
                        {mockCAPAs.map((capa, index) => (
                            <motion.div
                                key={capa.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="p-4 hover:border-blue-500/50 transition-colors cursor-pointer">
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${capa.type === "Corrective"
                                                    ? "bg-orange-100 text-orange-600"
                                                    : "bg-blue-100 text-blue-600"
                                                }`}>
                                                <Target className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-[var(--text-primary)]">
                                                        {capa.capaNumber}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${capa.type === "Corrective"
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-blue-100 text-blue-700"
                                                        }`}>
                                                        {capa.type}
                                                    </span>
                                                    {capa.ncrRef && (
                                                        <span className="text-xs text-[var(--text-muted)]">
                                                            → {capa.ncrRef}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-[var(--text-primary)] mt-1">
                                                    {capa.problem}
                                                </p>
                                                <p className="text-sm text-[var(--text-muted)]">
                                                    Action: {capa.action}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {capa.responsible}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        Target: {capa.targetDate}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${capa.status === "Completed"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                            }`}>
                                            {capa.status}
                                        </span>
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
