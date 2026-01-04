"use client"

import { useState } from "react"
import { Package, Plus, Search, Grid, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"
import { useParts, usePartCategories } from "@/hooks/useParts"

export default function PartsCatalogPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterCategory, setFilterCategory] = useState("All")

    // Real data from Supabase
    const { data: parts, isLoading, error } = useParts({
        category: filterCategory !== 'All' ? filterCategory : undefined,
        search: searchTerm || undefined
    })
    const { data: categories } = usePartCategories()

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Parts Catalog</h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Master data for motorcycle parts</p>
                    </div>
                    <Link href="/parts-catalog/new" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" /><span>Add Part</span>
                    </Link>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search parts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm"
                    >
                        <option value="All">All Categories</option>
                        {categories?.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12 text-red-500">
                        <p>Failed to load parts. Please apply database migrations first.</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && parts?.length === 0 && (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        <Grid className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No parts found</p>
                        <Link href="/parts-catalog/new" className="text-emerald-600 hover:underline mt-2 inline-block">
                            Add your first part
                        </Link>
                    </div>
                )}

                {/* Parts Grid */}
                {!isLoading && !error && parts && parts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {parts.map((part, index) => (
                            <motion.div
                                key={part.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/parts-catalog/${part.id}`}>
                                    <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors cursor-pointer">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-[var(--text-primary)]">{part.name}</h3>
                                                <p className="text-sm text-[var(--text-muted)]">{part.part_number}</p>
                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                    {part.category && (
                                                        <span className="px-2 py-0.5 text-xs bg-[var(--bg-tertiary)] rounded">{part.category}</span>
                                                    )}
                                                    <span className="text-xs text-[var(--text-muted)]">{part.unit_of_measure}</span>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${part.status === 'active' ? 'bg-green-100 text-green-700' :
                                                            part.status === 'development' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {part.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
