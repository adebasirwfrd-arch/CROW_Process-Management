"use client"

import { useEffect, useState } from "react"
import {
    Truck, Plus, Search, Filter, Star, MapPin,
    Phone, Mail, CheckCircle, AlertCircle, TrendingUp,
    MoreVertical, Building2, Award
} from "lucide-react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"

// Placeholder data - will be replaced with Supabase queries
const mockSuppliers = [
    {
        id: 1,
        code: "SUP-001",
        name: "PT Steel Indonesia",
        category: "Raw Material",
        status: "Active",
        rating: 4.5,
        isoCertified: true,
        city: "Jakarta",
        lastEvaluation: "2026-01-01"
    },
    {
        id: 2,
        code: "SUP-002",
        name: "CV Precision Parts",
        category: "Component",
        status: "Active",
        rating: 4.2,
        isoCertified: true,
        city: "Surabaya",
        lastEvaluation: "2025-12-15"
    },
    {
        id: 3,
        code: "SUP-003",
        name: "PT Rubber Tech",
        category: "Raw Material",
        status: "Probation",
        rating: 3.5,
        isoCertified: false,
        city: "Bandung",
        lastEvaluation: "2025-11-20"
    },
]

export default function SuppliersPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("All")

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
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Add Supplier</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Building2 className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--text-primary)]">24</p>
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
                                <p className="text-2xl font-bold text-[var(--text-primary)]">18</p>
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
                                <p className="text-2xl font-bold text-[var(--text-primary)]">15</p>
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
                                <p className="text-2xl font-bold text-[var(--text-primary)]">3</p>
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
                        <option value="Active">Active</option>
                        <option value="Probation">Probation</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {/* Suppliers List */}
                <div className="space-y-3">
                    {mockSuppliers.map((supplier, index) => (
                        <motion.div
                            key={supplier.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
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
                                                {supplier.isoCertified && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                                        ISO 9001
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-[var(--text-muted)]">{supplier.code}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {supplier.city}
                                                </span>
                                                <span className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded">
                                                    {supplier.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${supplier.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {supplier.status}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm font-medium">{supplier.rating}</span>
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
