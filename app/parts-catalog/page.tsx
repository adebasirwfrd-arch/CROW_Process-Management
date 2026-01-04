"use client"

import { useState } from "react"
import { Grid, Plus, Search, Filter, Package, Tag } from "lucide-react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"

const mockParts = [
    { id: 1, partNumber: "BD-001", name: "Brake Disc Assembly", category: "Braking", unit: "PCS", status: "Active" },
    { id: 2, partNumber: "EM-045", name: "Engine Mount Bracket", category: "Engine", unit: "PCS", status: "Active" },
    { id: 3, partNumber: "EP-012", name: "Exhaust Pipe Clamp", category: "Exhaust", unit: "PCS", status: "Active" },
    { id: 4, partNumber: "SU-008", name: "Front Suspension Link", category: "Suspension", unit: "SET", status: "Active" },
]

export default function PartsCatalogPage() {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Parts Catalog</h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Master data for motorcycle parts</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" /><span>Add Part</span>
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input type="text" placeholder="Search parts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockParts.map((part, index) => (
                        <motion.div key={part.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}>
                            <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors cursor-pointer">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-[var(--text-primary)]">{part.name}</h3>
                                        <p className="text-sm text-[var(--text-muted)]">{part.partNumber}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-0.5 text-xs bg-[var(--bg-tertiary)] rounded">{part.category}</span>
                                            <span className="text-xs text-[var(--text-muted)]">{part.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageTransition>
    )
}
