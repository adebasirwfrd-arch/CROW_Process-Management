"use client"

import { useState } from "react"
import { Package, Plus, Search, Box, Tag } from "lucide-react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"

const mockPackingRecords = [
    { id: 1, packingNumber: "PKG-2026-001", partName: "Brake Disc Assembly", partNumber: "BD-001", quantity: 100, lotNumber: "LOT-20260104-001", qcStatus: "Released" },
    { id: 2, packingNumber: "PKG-2026-002", partName: "Engine Mount Bracket", partNumber: "EM-045", quantity: 200, lotNumber: "LOT-20260104-002", qcStatus: "Pending" },
]

export default function PackingPage() {
    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Packing & Shipping</h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">ISO 9001:2015 - Clause 8.5.4 Preservation</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" /><span>New Packing</span>
                    </button>
                </div>
                <div className="space-y-3">
                    {mockPackingRecords.map((record, index) => (
                        <motion.div key={record.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                            <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600"><Package className="w-6 h-6" /></div>
                                        <div>
                                            <h3 className="font-semibold text-[var(--text-primary)]">{record.packingNumber}</h3>
                                            <p className="text-sm text-[var(--text-muted)]">{record.partName} ({record.partNumber})</p>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">Lot: {record.lotNumber} • Qty: {record.quantity}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${record.qcStatus === "Released" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{record.qcStatus}</span>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageTransition>
    )
}
