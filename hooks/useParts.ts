import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

// Types matching the database schema
export interface Part {
    id: number
    part_number: string
    name: string
    description: string | null
    category: string | null
    unit_of_measure: string
    standard_cost: number | null
    revision: string
    status: 'active' | 'obsolete' | 'development'
    drawing_number: string | null
    customer_part_number: string | null
    weight_kg: number | null
    dimensions: string | null
    material_spec: string | null
    created_at: string
    updated_at: string
}

export interface CreatePartInput {
    part_number: string
    name: string
    description?: string
    category?: string
    unit_of_measure?: string
    standard_cost?: number
    revision?: string
    status?: Part['status']
    drawing_number?: string
    customer_part_number?: string
    weight_kg?: number
    dimensions?: string
    material_spec?: string
}

// Fetch all parts
export function useParts(options?: { status?: string; category?: string; search?: string }) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['parts', options],
        queryFn: async () => {
            let query = supabase
                .from('parts')
                .select('*')
                .order('part_number', { ascending: true })

            if (options?.status && options.status !== 'All') {
                query = query.eq('status', options.status.toLowerCase())
            }
            if (options?.category && options.category !== 'All') {
                query = query.eq('category', options.category)
            }
            if (options?.search) {
                query = query.or(`part_number.ilike.%${options.search}%,name.ilike.%${options.search}%`)
            }

            const { data, error } = await query

            if (error) throw error
            return data as Part[]
        }
    })
}

// Fetch single part
export function usePart(id: number) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['part', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('parts')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            return data as Part
        },
        enabled: !!id
    })
}

// Create part
export function useCreatePart() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (input: CreatePartInput) => {
            const { data, error } = await supabase
                .from('parts')
                .insert(input)
                .select()
                .single()

            if (error) throw error
            return data as Part
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parts'] })
        }
    })
}

// Update part
export function useUpdatePart() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, ...input }: Partial<Part> & { id: number }) => {
            const { data, error } = await supabase
                .from('parts')
                .update({ ...input, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data as Part
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['parts'] })
            queryClient.invalidateQueries({ queryKey: ['part', data.id] })
        }
    })
}

// Delete part
export function useDeletePart() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => {
            const { error } = await supabase
                .from('parts')
                .delete()
                .eq('id', id)

            if (error) throw error
            return id
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parts'] })
        }
    })
}

// Part categories for filtering
export function usePartCategories() {
    const supabase = createClient()

    return useQuery({
        queryKey: ['part-categories'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('parts')
                .select('category')
                .not('category', 'is', null)

            if (error) throw error

            const categories = [...new Set(data.map(p => p.category).filter(Boolean))]
            return categories as string[]
        }
    })
}
