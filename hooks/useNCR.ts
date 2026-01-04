import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

// Types matching the database schema
export interface NCR {
    id: number
    ncr_number: string
    source: 'incoming' | 'in_process' | 'final' | 'customer' | 'audit'
    part_id: number | null
    work_order_id: number | null
    supplier_id: number | null
    lot_number: string | null
    defect_description: string
    defect_quantity: number
    status: 'open' | 'under_investigation' | 'pending_disposition' | 'closed'
    detected_by: string | null
    detected_date: string
    root_cause: string | null
    disposition: 'use_as_is' | 'rework' | 'scrap' | 'return_to_supplier' | 'pending' | null
    disposition_date: string | null
    disposition_by: string | null
    containment_action: string | null
    cost_impact: number | null
    closed_date: string | null
    closed_by: string | null
    notes: string | null
    created_at: string
    // Joined data
    part?: { part_number: string; name: string }
    supplier?: { code: string; name: string }
}

export interface CAPA {
    id: number
    capa_number: string
    ncr_id: number | null
    capa_type: 'corrective' | 'preventive'
    problem_statement: string
    root_cause_analysis: string | null
    proposed_action: string
    status: 'open' | 'in_progress' | 'verification' | 'closed' | 'cancelled'
    responsible_person: string | null
    target_date: string | null
    completion_date: string | null
    effectiveness_verified: boolean
    verification_date: string | null
    verification_notes: string | null
    created_at: string
}

export interface CreateNCRInput {
    ncr_number: string
    source: NCR['source']
    part_id?: number
    supplier_id?: number
    work_order_id?: number
    lot_number?: string
    defect_description: string
    defect_quantity: number
    containment_action?: string
    notes?: string
}

// Fetch all NCRs
export function useNCRs(options?: { status?: string; source?: string }) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['ncrs', options],
        queryFn: async () => {
            let query = supabase
                .from('ncr_reports')
                .select(`
                    *,
                    part:parts(part_number, name),
                    supplier:suppliers(code, name)
                `)
                .order('detected_date', { ascending: false })

            if (options?.status && options.status !== 'All') {
                query = query.eq('status', options.status.toLowerCase().replace(' ', '_'))
            }
            if (options?.source && options.source !== 'All') {
                query = query.eq('source', options.source.toLowerCase())
            }

            const { data, error } = await query
            if (error) throw error
            return data as NCR[]
        }
    })
}

// Fetch single NCR with CAPAs
export function useNCR(id: number) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['ncr', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('ncr_reports')
                .select(`
                    *,
                    part:parts(part_number, name),
                    supplier:suppliers(code, name),
                    capas:capa_actions(*)
                `)
                .eq('id', id)
                .single()

            if (error) throw error
            return data as NCR & { capas: CAPA[] }
        },
        enabled: !!id
    })
}

// Create NCR
export function useCreateNCR() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (input: CreateNCRInput) => {
            const { data, error } = await supabase
                .from('ncr_reports')
                .insert({
                    ...input,
                    status: 'open',
                    detected_date: new Date().toISOString()
                })
                .select()
                .single()

            if (error) throw error
            return data as NCR
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ncrs'] })
            queryClient.invalidateQueries({ queryKey: ['ncr-stats'] })
        }
    })
}

// Update NCR
export function useUpdateNCR() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...input }: Partial<NCR> & { id: number }) => {
            const { data, error } = await supabase
                .from('ncr_reports')
                .update(input)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data as NCR
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['ncrs'] })
            queryClient.invalidateQueries({ queryKey: ['ncr', data.id] })
        }
    })
}

// NCR Statistics
export function useNCRStats() {
    const supabase = createClient()

    return useQuery({
        queryKey: ['ncr-stats'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('ncr_reports')
                .select('status, source, disposition')

            if (error) throw error

            const open = data.filter(n => n.status === 'open').length
            const underInvestigation = data.filter(n => n.status === 'under_investigation').length
            const closed = data.filter(n => n.status === 'closed').length
            const total = data.length

            return { open, underInvestigation, closed, total }
        }
    })
}

// Fetch CAPAs
export function useCAPAs(options?: { status?: string; type?: string }) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['capas', options],
        queryFn: async () => {
            let query = supabase
                .from('capa_actions')
                .select('*')
                .order('created_at', { ascending: false })

            if (options?.status && options.status !== 'All') {
                query = query.eq('status', options.status.toLowerCase())
            }
            if (options?.type && options.type !== 'All') {
                query = query.eq('capa_type', options.type.toLowerCase())
            }

            const { data, error } = await query
            if (error) throw error
            return data as CAPA[]
        }
    })
}

// Create CAPA
export function useCreateCAPA() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (input: Partial<CAPA>) => {
            const { data, error } = await supabase
                .from('capa_actions')
                .insert({
                    ...input,
                    status: 'open'
                })
                .select()
                .single()

            if (error) throw error
            return data as CAPA
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['capas'] })
        }
    })
}
