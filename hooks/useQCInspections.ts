import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

// Types matching the database schema
export interface QCInspection {
    id: number
    inspection_number: string
    checkpoint_id: number | null
    work_order_id: number | null
    lot_number: string | null
    part_id: number | null
    inspection_type: 'incoming' | 'in_process' | 'final' | 'periodic'
    inspection_date: string
    inspector_id: string | null
    sample_size: number
    accepted_qty: number
    rejected_qty: number
    result: 'passed' | 'failed' | 'conditional'
    notes: string | null
    created_at: string
    // Joined data
    part?: { part_number: string; name: string }
    work_order?: { order_number: string }
    checkpoint?: { name: string; checkpoint_type: string }
}

export interface CreateQCInspectionInput {
    inspection_number: string
    checkpoint_id?: number
    work_order_id?: number
    lot_number?: string
    part_id?: number
    inspection_type: QCInspection['inspection_type']
    sample_size: number
    accepted_qty: number
    rejected_qty: number
    result: QCInspection['result']
    notes?: string
}

// Fetch all QC inspections
export function useQCInspections(options?: { type?: string; result?: string }) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['qc-inspections', options],
        queryFn: async () => {
            let query = supabase
                .from('qc_inspections')
                .select(`
                    *,
                    part:parts(part_number, name),
                    work_order:work_orders(order_number),
                    checkpoint:qc_checkpoints(name, checkpoint_type)
                `)
                .order('inspection_date', { ascending: false })
                .limit(100)

            if (options?.type && options.type !== 'All') {
                query = query.eq('inspection_type', options.type.toLowerCase())
            }
            if (options?.result && options.result !== 'All') {
                query = query.eq('result', options.result.toLowerCase())
            }

            const { data, error } = await query
            if (error) throw error
            return data as QCInspection[]
        }
    })
}

// Fetch single inspection
export function useQCInspection(id: number) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['qc-inspection', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('qc_inspections')
                .select(`
                    *,
                    part:parts(part_number, name),
                    work_order:work_orders(order_number),
                    checkpoint:qc_checkpoints(name, checkpoint_type)
                `)
                .eq('id', id)
                .single()

            if (error) throw error
            return data as QCInspection
        },
        enabled: !!id
    })
}

// Create inspection
export function useCreateQCInspection() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (input: CreateQCInspectionInput) => {
            const { data, error } = await supabase
                .from('qc_inspections')
                .insert({
                    ...input,
                    inspection_date: new Date().toISOString()
                })
                .select()
                .single()

            if (error) throw error
            return data as QCInspection
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['qc-inspections'] })
            queryClient.invalidateQueries({ queryKey: ['qc-stats'] })
        }
    })
}

// QC Statistics
export function useQCStats() {
    const supabase = createClient()

    return useQuery({
        queryKey: ['qc-stats'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('qc_inspections')
                .select('result, accepted_qty, rejected_qty, sample_size')

            if (error) throw error

            const total = data.length
            const passed = data.filter(i => i.result === 'passed').length
            const failed = data.filter(i => i.result === 'failed').length

            const totalAccepted = data.reduce((sum, i) => sum + (i.accepted_qty || 0), 0)
            const totalRejected = data.reduce((sum, i) => sum + (i.rejected_qty || 0), 0)
            const totalSampled = data.reduce((sum, i) => sum + (i.sample_size || 0), 0)

            const fpy = totalSampled > 0
                ? ((totalAccepted / totalSampled) * 100).toFixed(1)
                : '0'

            const ppm = totalSampled > 0
                ? Math.round((totalRejected / totalSampled) * 1000000)
                : 0

            return { total, passed, failed, fpy, ppm }
        }
    })
}

// QC Checkpoints
export function useQCCheckpoints() {
    const supabase = createClient()

    return useQuery({
        queryKey: ['qc-checkpoints'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('qc_checkpoints')
                .select('*')
                .eq('is_active', true)
                .order('sequence_order', { ascending: true })

            if (error) throw error
            return data
        }
    })
}
