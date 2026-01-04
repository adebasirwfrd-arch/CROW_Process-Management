"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import {
  Factory, Package, CheckCircle2, AlertTriangle, Truck,
  Gauge, TrendingUp, Clock, BarChart3, Activity, Cpu
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"

// Mock KPI data - will be replaced with Supabase queries
const mockKPIs = {
  oee: 87.5,
  fpy: 98.2,
  ppm: 320,
  otd: 96.5,
  activeOrders: 12,
  openNCRs: 3,
  machinesRunning: 8,
  pendingShipments: 5
}

const mockRecentActivity = [
  { id: 1, type: "production", message: "PO-2026-001 completed - Brake Disc Assembly", time: "5 min ago" },
  { id: 2, type: "qc", message: "QC-2026-015 passed - Engine Mount Bracket (Lot 042)", time: "12 min ago" },
  { id: 3, type: "ncr", message: "NCR-2026-003 raised - Dimensional deviation on EP-012", time: "25 min ago" },
  { id: 4, type: "shipping", message: "SHP-2026-008 dispatched to PT Honda Motor", time: "1 hour ago" },
]

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6 pb-20 md:pb-0">
        {/* Hero Header */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-lg">
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  CROW Process Dashboard
                </h1>
                <p className="text-sm text-white/80 mt-1">
                  ISO 9001:2015 Manufacturing Control Center
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                  <p className="text-2xl font-bold text-white">{mockKPIs.oee}%</p>
                  <p className="text-xs text-white/80">OEE Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Gauge className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{mockKPIs.oee}%</p>
                  <p className="text-xs text-[var(--text-muted)]">OEE Score</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{mockKPIs.fpy}%</p>
                  <p className="text-xs text-[var(--text-muted)]">First Pass Yield</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{mockKPIs.ppm}</p>
                  <p className="text-xs text-[var(--text-muted)]">Defect PPM</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">{mockKPIs.otd}%</p>
                  <p className="text-xs text-[var(--text-muted)]">On-Time Delivery</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/production">
            <GlassCard className="p-4 hover:border-emerald-500/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{mockKPIs.activeOrders}</p>
                  <p className="text-sm text-[var(--text-muted)]">Active Orders</p>
                </div>
                <Factory className="w-8 h-8 text-emerald-500" />
              </div>
            </GlassCard>
          </Link>

          <Link href="/ncr">
            <GlassCard className="p-4 hover:border-red-500/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-red-600">{mockKPIs.openNCRs}</p>
                  <p className="text-sm text-[var(--text-muted)]">Open NCRs</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </GlassCard>
          </Link>

          <Link href="/machines">
            <GlassCard className="p-4 hover:border-blue-500/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{mockKPIs.machinesRunning}</p>
                  <p className="text-sm text-[var(--text-muted)]">Machines Running</p>
                </div>
                <Cpu className="w-8 h-8 text-blue-500" />
              </div>
            </GlassCard>
          </Link>

          <Link href="/packing">
            <GlassCard className="p-4 hover:border-purple-500/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-[var(--text-primary)]">{mockKPIs.pendingShipments}</p>
                  <p className="text-sm text-[var(--text-muted)]">Pending Shipments</p>
                </div>
                <Package className="w-8 h-8 text-purple-500" />
              </div>
            </GlassCard>
          </Link>
        </div>

        {/* Quick Links + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick Links */}
          <GlassCard className="p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { href: "/production", label: "New Production Order", icon: Factory },
                { href: "/incoming-qc", label: "Record Receiving", icon: Package },
                { href: "/quality", label: "New QC Inspection", icon: CheckCircle2 },
                { href: "/ncr", label: "Raise NCR", icon: AlertTriangle },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <link.icon className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-[var(--text-primary)]">{link.label}</span>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard className="lg:col-span-2 p-4">
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)]">
                  <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === "production" ? "bg-emerald-500" :
                      activity.type === "qc" ? "bg-green-500" :
                        activity.type === "ncr" ? "bg-red-500" : "bg-blue-500"
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm text-[var(--text-primary)]">{activity.message}</p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  )
}
