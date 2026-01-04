"use client"

import { useState } from "react"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { PageTransition } from "@/components/ui/page-transition"
import { useCreateSupplier } from "@/hooks/useSuppliers"

export default function NewSupplierPage() {
    const router = useRouter()
    const createSupplier = useCreateSupplier()

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        category: "raw_material" as const,
        status: "active" as const,
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        is_iso_certified: false,
        iso_cert_expiry: "",
        payment_terms: "",
        lead_time_days: "",
        notes: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await createSupplier.mutateAsync({
                code: formData.code,
                name: formData.name,
                category: formData.category,
                status: formData.status,
                contact_person: formData.contact_person || undefined,
                email: formData.email || undefined,
                phone: formData.phone || undefined,
                address: formData.address || undefined,
                city: formData.city || undefined,
                country: formData.country || undefined,
                is_iso_certified: formData.is_iso_certified,
                iso_cert_expiry: formData.iso_cert_expiry || undefined,
                payment_terms: formData.payment_terms || undefined,
                lead_time_days: formData.lead_time_days ? parseInt(formData.lead_time_days) : undefined,
                notes: formData.notes || undefined
            })
            router.push('/suppliers')
        } catch (error) {
            console.error('Failed to create supplier:', error)
            alert('Failed to create supplier. Please try again.')
        }
    }

    return (
        <PageTransition>
            <div className="space-y-6 max-w-3xl mx-auto">
                {/* Back Link */}
                <Link href="/suppliers" className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Suppliers
                </Link>

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Add New Supplier</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        ISO 9001:2015 - Clause 8.4 Control of External Providers
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <GlassCard className="p-6">
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    Supplier Code *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="e.g., SUP-001"
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    Supplier Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Company name"
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="raw_material">Raw Material</option>
                                    <option value="component">Component</option>
                                    <option value="service">Service</option>
                                    <option value="packaging">Packaging</option>
                                    <option value="consumable">Consumable</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    Status
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="probation">Probation</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Contact Info */}
                    <GlassCard className="p-6">
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    Contact Person
                                </label>
                                <input
                                    type="text"
                                    value={formData.contact_person}
                                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {/* ISO & Terms */}
                    <GlassCard className="p-6">
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Certification & Terms</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="iso_certified"
                                    checked={formData.is_iso_certified}
                                    onChange={(e) => setFormData({ ...formData, is_iso_certified: e.target.checked })}
                                    className="w-4 h-4 text-emerald-600 border-[var(--border-light)] rounded focus:ring-emerald-500"
                                />
                                <label htmlFor="iso_certified" className="text-sm font-medium text-[var(--text-primary)]">
                                    ISO 9001 Certified
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    ISO Cert Expiry
                                </label>
                                <input
                                    type="date"
                                    value={formData.iso_cert_expiry}
                                    onChange={(e) => setFormData({ ...formData, iso_cert_expiry: e.target.value })}
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    Payment Terms
                                </label>
                                <input
                                    type="text"
                                    value={formData.payment_terms}
                                    onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                                    placeholder="e.g., Net 30"
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                    Lead Time (days)
                                </label>
                                <input
                                    type="number"
                                    value={formData.lead_time_days}
                                    onChange={(e) => setFormData({ ...formData, lead_time_days: e.target.value })}
                                    min="0"
                                    className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Notes */}
                    <GlassCard className="p-6">
                        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Notes</h3>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            placeholder="Additional notes about this supplier..."
                            className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        />
                    </GlassCard>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Link href="/suppliers" className="px-4 py-2 border border-[var(--border-light)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={createSupplier.isPending}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                        >
                            {createSupplier.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Supplier
                        </button>
                    </div>
                </form>
            </div>
        </PageTransition>
    )
}
