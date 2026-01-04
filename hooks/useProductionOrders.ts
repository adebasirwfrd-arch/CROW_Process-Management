import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

// Types matching the database schema
export interface ProductionOrder {
    id: number
    order_number: string
    part_id: number
    production_line_id: number | null
    quantity_ordered: number
    quantity_completed: number
    quantity_rejected: number
    status: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled'
    priority: 'low' | 'normal' | 'high' | 'urgent'
    planned_start: string | null
    planned_end: string | null
    actual_start: string | null
    actual_end: string | null
    customer_po: string | null
    notes: string | null
    created_by: string | null
    created_at: string
    updated_at: string
    // Joined data
    part?: {
        part_number: string
        name: string
    }
    production_line?: {
        name: string
        code: string
    }
}

export interface CreateProductionOrderInput {
    order_number: string
    part_id: number
    production_line_id?: number
    quantity_ordered: number
    priority?: ProductionOrder['priority']
    planned_start?: string
    planned_end?: string
    customer_po?: string
    notes?: string
}

// Fetch all production orders
export function useProductionOrders(options?: { status?: string; priority?: string }) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['production-orders', options],
        queryFn: async () => {
            let query = supabase
                .from('work_orders')
                .select(`
                    *,
                    part:parts(part_number, name),
                    production_line:production_lines(name, code)
                `)
                .order('created_at', { ascending: false })

            if (options?.status && options.status !== 'All') {
                query = query.eq('status', options.status.toLowerCase())
            }
            if (options?.priority && options.priority !== 'All') {
                query = query.eq('priority', options.priority.toLowerCase())
            }

            const { data, error } = await query

            if (error) throw error
            return data as ProductionOrder[]
        }
    })
}

// Fetch single production order
export function useProductionOrder(id: number) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['production-order', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('work_orders')
                .select(`
                    *,
                    part:parts(part_number, name),
                    production_line:production_lines(name, code)
                `)
                .eq('id', id)
                .single()

            if (error) throw error
            return data as ProductionOrder
        },
        enabled: !!id
    })
}

// Create production order
export function useCreateProductionOrder() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (input: CreateProductionOrderInput) => {
            const { data, error } = await supabase
                .from('work_orders')
                .insert({
                    ...input,
                    status: 'pending',
                    quantity_completed: 0,
                    quantity_rejected: 0
                })
                .select()
                .single()

            if (error) throw error
            return data as ProductionOrder
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['production-orders'] })
        }
    })
}

// Update production order
export function useUpdateProductionOrder() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...input }: Partial<ProductionOrder> & { id: number }) => {
            const { data, error } = await supabase
                .from('work_orders')
                .update({ ...input, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data as ProductionOrder
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['production-orders'] })
            queryClient.invalidateQueries({ queryKey: ['production-order', data.id] })
        }
    })
}

// Production order statistics
export function useProductionStats() {
    const supabase = createClient()

    return useQuery({
        queryKey: ['production-stats'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('work_orders')
                .select('status, quantity_ordered, quantity_completed, quantity_rejected')

            if (error) throw error

            const activeOrders = data.filter(o => o.status === 'in_progress').length
            const pendingOrders = data.filter(o => o.status === 'pending').length
            const completedToday = data.filter(o => o.status === 'completed').length

            const totalOrdered = data.reduce((sum, o) => sum + (o.quantity_ordered || 0), 0)
            const totalCompleted = data.reduce((sum, o) => sum + (o.quantity_completed || 0), 0)
            const totalRejected = data.reduce((sum, o) => sum + (o.quantity_rejected || 0), 0)

            const fpy = totalCompleted > 0
                ? ((totalCompleted - totalRejected) / totalCompleted * 100).toFixed(1)
                : '0'

            return { activeOrders, pendingOrders, completedToday, fpy }
        }
    })
}

// Production lines
export function useProductionLines() {
    const supabase = createClient()

    return useQuery({
        queryKey: ['production-lines'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('production_lines')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error
            return data
        }
    })
}
