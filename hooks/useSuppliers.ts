import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

// Types matching the database schema
export interface Supplier {
    id: number
    code: string
    name: string
    category: 'raw_material' | 'component' | 'service' | 'packaging' | 'consumable'
    status: 'active' | 'probation' | 'inactive' | 'blacklisted'
    contact_person: string | null
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    country: string | null
    is_iso_certified: boolean
    iso_cert_expiry: string | null
    payment_terms: string | null
    lead_time_days: number | null
    current_rating: number | null
    notes: string | null
    created_at: string
    updated_at: string
}

export interface SupplierEvaluation {
    id: number
    supplier_id: number
    evaluation_date: string
    evaluator_id: string | null
    quality_score: number
    delivery_score: number
    price_score: number
    service_score: number
    overall_score: number
    comments: string | null
    recommendation: string | null
}

export interface CreateSupplierInput {
    code: string
    name: string
    category: Supplier['category']
    status?: Supplier['status']
    contact_person?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    country?: string
    is_iso_certified?: boolean
    iso_cert_expiry?: string
    payment_terms?: string
    lead_time_days?: number
    notes?: string
}

// Fetch all suppliers
export function useSuppliers(options?: { status?: string; category?: string }) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['suppliers', options],
        queryFn: async () => {
            let query = supabase
                .from('suppliers')
                .select('*')
                .order('name', { ascending: true })

            if (options?.status && options.status !== 'All') {
                query = query.eq('status', options.status.toLowerCase())
            }
            if (options?.category && options.category !== 'All') {
                query = query.eq('category', options.category.toLowerCase())
            }

            const { data, error } = await query

            if (error) throw error
            return data as Supplier[]
        }
    })
}

// Fetch single supplier with evaluations
export function useSupplier(id: number) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['supplier', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('suppliers')
                .select(`
                    *,
                    supplier_evaluations (*)
                `)
                .eq('id', id)
                .single()

            if (error) throw error
            return data as Supplier & { supplier_evaluations: SupplierEvaluation[] }
        },
        enabled: !!id
    })
}

// Create supplier
export function useCreateSupplier() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (input: CreateSupplierInput) => {
            const { data, error } = await supabase
                .from('suppliers')
                .insert(input)
                .select()
                .single()

            if (error) throw error
            return data as Supplier
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        }
    })
}

// Update supplier
export function useUpdateSupplier() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...input }: Partial<Supplier> & { id: number }) => {
            const { data, error } = await supabase
                .from('suppliers')
                .update({ ...input, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data as Supplier
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] })
            queryClient.invalidateQueries({ queryKey: ['supplier', data.id] })
        }
    })
}

// Delete supplier
export function useDeleteSupplier() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase
                .from('suppliers')
                .delete()
                .eq('id', id)

            if (error) throw error
            return id
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['suppliers'] })
        }
    })
}

// Supplier statistics
export function useSupplierStats() {
    const supabase = createClient()

    return useQuery({
        queryKey: ['supplier-stats'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('suppliers')
                .select('status, is_iso_certified')

            if (error) throw error

            const total = data.length
            const active = data.filter(s => s.status === 'active').length
            const probation = data.filter(s => s.status === 'probation').length
            const isoCertified = data.filter(s => s.is_iso_certified).length

            return { total, active, probation, isoCertified }
        }
    })
}
