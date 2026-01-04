"use client"

import { use } from "react"
import { ArrowLeft, Star, MapPin, Phone, Mail, Award, Calendar, Edit, Building2, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"
import { useSupplier } from "@/hooks/useSuppliers"

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const supplierId = parseInt(id)

    const { data: supplier, isLoading, error } = useSupplier(supplierId)

    if (isLoading) {
        return (
            <PageTransition>
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
            </PageTransition>
        )
    }

    if (error || !supplier) {
        return (
            <PageTransition>
                <div className="space-y-6">
                    <Link href="/suppliers" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Suppliers
                    </Link>
                    <div className="text-center py-12 text-red-500">
                        <p>Supplier not found or database not configured.</p>
                    </div>
                </div>
            </PageTransition>
        )
    }

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Back Link */}
                <Link href="/suppliers" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Suppliers
                </Link>

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                            {supplier.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl font-bold text-[var(--text-primary)]">{supplier.name}</h1>
                                {supplier.is_iso_certified && (
                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium flex items-center gap-1">
                                        <Award className="w-3 h-3" />
                                        ISO 9001
                                    </span>
                                )}
                            </div>
                            <p className="text-[var(--text-muted)]">{supplier.code}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${supplier.status === "active" ? "bg-green-100 text-green-700" :
                                        supplier.status === "probation" ? "bg-yellow-100 text-yellow-700" :
                                            "bg-gray-100 text-gray-700"
                                    }`}>
                                    {supplier.status}
                                </span>
                                <span className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded capitalize">
                                    {supplier.category?.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-[var(--border-light)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit Supplier
                    </button>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Contact Info */}
                    <GlassCard className="p-4">
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                            Contact Information
                        </h3>
                        <div className="space-y-3">
                            {supplier.contact_person && (
                                <div className="text-sm">
                                    <p className="text-[var(--text-muted)]">Contact Person</p>
                                    <p className="font-medium">{supplier.contact_person}</p>
                                </div>
                            )}
                            {supplier.email && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="w-4 h-4 text-[var(--text-muted)]" />
                                    <a href={`mailto:${supplier.email}`} className="text-emerald-600 hover:underline">
                                        {supplier.email}
                                    </a>
                                </div>
                            )}
                            {supplier.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-[var(--text-muted)]" />
                                    <span>{supplier.phone}</span>
                                </div>
                            )}
                            {(supplier.city || supplier.country) && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                                    <span>{[supplier.city, supplier.country].filter(Boolean).join(', ')}</span>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Performance Metrics */}
                    <GlassCard className="p-4">
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            Performance Rating
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="text-4xl font-bold text-[var(--text-primary)]">
                                {supplier.current_rating ?? 'N/A'}
                            </div>
                            {supplier.current_rating && (
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${star <= Math.round(supplier.current_rating!) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">Based on quality, delivery, and service evaluations</p>
                    </GlassCard>

                    {/* Terms */}
                    <GlassCard className="p-4">
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Terms & Lead Time
                        </h3>
                        <div className="space-y-3">
                            <div className="text-sm">
                                <p className="text-[var(--text-muted)]">Payment Terms</p>
                                <p className="font-medium">{supplier.payment_terms || 'Not specified'}</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-[var(--text-muted)]">Lead Time</p>
                                <p className="font-medium">{supplier.lead_time_days ? `${supplier.lead_time_days} days` : 'Not specified'}</p>
                            </div>
                            {supplier.iso_cert_expiry && (
                                <div className="text-sm">
                                    <p className="text-[var(--text-muted)]">ISO Cert Expiry</p>
                                    <p className="font-medium">{new Date(supplier.iso_cert_expiry).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>

                {/* Evaluation History */}
                <GlassCard className="p-4">
                    <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        Evaluation History
                    </h3>
                    {supplier.supplier_evaluations?.length === 0 ? (
                        <p className="text-[var(--text-muted)] text-center py-8">No evaluations recorded yet</p>
                    ) : (
                        <div className="space-y-3">
                            {supplier.supplier_evaluations?.map((eval: any) => (
                                <motion.div
                                    key={eval.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">{new Date(eval.evaluation_date).toLocaleDateString()}</p>
                                        <p className="text-sm text-[var(--text-muted)]">{eval.recommendation}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-bold">{eval.overall_score}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </GlassCard>

                {/* Notes */}
                {supplier.notes && (
                    <GlassCard className="p-4">
                        <h3 className="font-semibold text-[var(--text-primary)] mb-2">Notes</h3>
                        <p className="text-sm text-[var(--text-muted)]">{supplier.notes}</p>
                    </GlassCard>
                )}
            </div>
        </PageTransition>
    )
}
