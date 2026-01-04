"use client"

import { useState } from "react"
import {
    Truck, Plus, Search, Star, MapPin,
    CheckCircle, AlertCircle, Building2, Award, Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"
import { useSuppliers, useSupplierStats } from "@/hooks/useSuppliers"

export default function SuppliersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("All")

    // Real data from Supabase
    const { data: suppliers, isLoading, error } = useSuppliers({
        status: filterStatus !== 'All' ? filterStatus : undefined
    })
    const { data: stats } = useSupplierStats()

    // Filter by search term
    const filteredSuppliers = suppliers?.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                            Supplier Management
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            ISO 9001:2015 - Clause 8.4 External Providers
                        </p>
                    </div>
                    <Link href="/suppliers/new" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Add Supplier</span>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Building2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.total ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Total Suppliers</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.active ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">Active</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Award className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.isoCertified ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">ISO Certified</p>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats?.probation ?? '-'}</p>
                                <p className="text-xs text-[var(--text-muted)]">On Probation</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="All">All Status</option>
                        <option value="active">Active</option>
                        <option value="probation">Probation</option>
                        <option value="inactive">Inactive</option>
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
                        <p>Failed to load suppliers. Please apply database migrations first.</p>
                        <p className="text-sm text-[var(--text-muted)] mt-2">Run supabase_manufacturing_schema.sql in Supabase SQL Editor</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredSuppliers.length === 0 && (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No suppliers found</p>
                        <Link href="/suppliers/new" className="text-emerald-600 hover:underline mt-2 inline-block">
                            Add your first supplier
                        </Link>
                    </div>
                )}

                {/* Suppliers List */}
                {!isLoading && !error && filteredSuppliers.length > 0 && (
                    <div className="space-y-3">
                        {filteredSuppliers.map((supplier, index) => (
                            <motion.div
                                key={supplier.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/suppliers/${supplier.id}`}>
                                    <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors cursor-pointer">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                                                    {supplier.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-[var(--text-primary)]">
                                                            {supplier.name}
                                                        </h3>
                                                        {supplier.is_iso_certified && (
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                                ISO 9001
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-[var(--text-muted)]">{supplier.code}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                                                        {supplier.city && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" />
                                                                {supplier.city}
                                                            </span>
                                                        )}
                                                        <span className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded capitalize">
                                                            {supplier.category?.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${supplier.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : supplier.status === "probation"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}>
                                                    {supplier.status}
                                                </span>
                                                {supplier.current_rating && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        <span className="text-sm font-medium">{supplier.current_rating}</span>
                                                    </div>
                                                )}
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
