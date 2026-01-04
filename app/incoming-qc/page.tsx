"use client"

import { useState } from "react"
import {
    PackageCheck, Search, Plus, CheckCircle, XCircle,
    AlertCircle, Truck, Calendar, ClipboardList
} from "lucide-react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"

// Mock receiving data
const mockReceivings = [
    {
        id: 1,
        receivingNumber: "RCV-2026-001",
        poNumber: "PO-2026-001",
        supplier: "PT Steel Indonesia",
        receivedDate: "2026-01-04",
        status: "Pending Inspection",
        items: 5,
        totalQty: 1000
    },
    {
        id: 2,
        receivingNumber: "RCV-2026-002",
        poNumber: "PO-2026-002",
        supplier: "CV Precision Parts",
        receivedDate: "2026-01-04",
        status: "Passed",
        items: 3,
        totalQty: 500
    },
    {
        id: 3,
        receivingNumber: "RCV-2025-098",
        poNumber: "PO-2025-095",
        supplier: "PT Rubber Tech",
        receivedDate: "2025-12-30",
        status: "Failed",
        items: 2,
        totalQty: 200
    },
]

export default function IncomingQCPage() {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                            Incoming Inspection
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            ISO 9001:2015 - Clause 8.4.2 Type & Extent of Control
                        </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Record Receiving</span>
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <ClipboardList className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">8</p>
                                <p className="text-xs text-[var(--text-muted)]">Pending Inspection</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">42</p>
                                <p className="text-xs text-[var(--text-muted)]">Passed (MTD)</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">3</p>
                                <p className="text-xs text-[var(--text-muted)]">Failed (MTD)</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Truck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">93%</p>
                                <p className="text-xs text-[var(--text-muted)]">Acceptance Rate</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search by receiving number, PO, or supplier..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* Receiving List */}
                <div className="space-y-3">
                    {mockReceivings.map((receiving, index) => (
                        <motion.div
                            key={receiving.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors cursor-pointer">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${receiving.status === "Passed"
                                                ? "bg-green-100 text-green-600"
                                                : receiving.status === "Failed"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                            }`}>
                                            <PackageCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-semibold text-[var(--text-primary)]">
                                                    {receiving.receivingNumber}
                                                </h3>
                                                <span className="text-xs text-[var(--text-muted)]">
                                                    → {receiving.poNumber}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[var(--text-muted)]">
                                                From: {receiving.supplier}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {receiving.receivedDate}
                                                </span>
                                                <span>{receiving.items} items • {receiving.totalQty} pcs</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${receiving.status === "Passed"
                                            ? "bg-green-100 text-green-700"
                                            : receiving.status === "Failed"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {receiving.status}
                                    </span>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageTransition>
    )
}
