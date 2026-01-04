import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

// Types matching the database schema
export interface Machine {
    id: number
    code: string
    name: string
    machine_type: string | null
    production_line_id: number | null
    manufacturer: string | null
    model: string | null
    serial_number: string | null
    installation_date: string | null
    status: 'running' | 'idle' | 'maintenance' | 'breakdown' | 'offline'
    iot_enabled: boolean
    last_maintenance_date: string | null
    next_maintenance_date: string | null
    notes: string | null
    created_at: string
    // Joined data
    production_line?: { name: string; code: string }
}

export interface MachineParameter {
    id: number
    machine_id: number
    parameter_name: string
    parameter_code: string
    unit: string | null
    min_value: number | null
    max_value: number | null
    target_value: number | null
    is_critical: boolean
    created_at: string
}

export interface MachineAlarm {
    id: number
    machine_id: number
    parameter_id: number | null
    alarm_type: 'warning' | 'critical' | 'info'
    message: string
    triggered_at: string
    acknowledged_at: string | null
    acknowledged_by: string | null
    resolved_at: string | null
    notes: string | null
}

// Fetch all machines
export function useMachines(options?: { status?: string; lineId?: number }) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['machines', options],
        queryFn: async () => {
            let query = supabase
                .from('machines')
                .select(`
                    *,
                    production_line:production_lines(name, code)
                `)
                .order('name', { ascending: true })

            if (options?.status && options.status !== 'All') {
                query = query.eq('status', options.status.toLowerCase())
            }
            if (options?.lineId) {
                query = query.eq('production_line_id', options.lineId)
            }

            const { data, error } = await query
            if (error) throw error
            return data as Machine[]
        }
    })
}

// Fetch single machine with parameters
export function useMachine(id: number) {
    const supabase = createClient()

    return useQuery({
        queryKey: ['machine', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('machines')
                .select(`
                    *,
                    production_line:production_lines(name, code),
                    parameters:machine_parameters(*),
                    alarms:machine_alarms(*)
                `)
                .eq('id', id)
                .single()

            if (error) throw error
            return data as Machine & {
                parameters: MachineParameter[]
                alarms: MachineAlarm[]
            }
        },
        enabled: !!id
    })
}

// Machine statistics
export function useMachineStats() {
    const supabase = createClient()

    return useQuery({
        queryKey: ['machine-stats'],
        queryFn: async () => {
            const { data: machines, error: machineError } = await supabase
                .from('machines')
                .select('status')

            if (machineError) throw machineError

            const { data: alarms, error: alarmError } = await supabase
                .from('machine_alarms')
                .select('alarm_type')
                .is('resolved_at', null)

            if (alarmError) throw alarmError

            const running = machines.filter(m => m.status === 'running').length
            const idle = machines.filter(m => m.status === 'idle').length
            const maintenance = machines.filter(m => m.status === 'maintenance').length
            const breakdown = machines.filter(m => m.status === 'breakdown').length
            const total = machines.length
            const activeAlarms = alarms.length

            // Calculate OEE (simplified - would need more data in real scenario)
            const oee = total > 0 ? ((running / total) * 100).toFixed(1) : '0'

            return { running, idle, maintenance, breakdown, total, activeAlarms, oee }
        }
    })
}

// Active alarms
export function useActiveAlarms() {
    const supabase = createClient()

    return useQuery({
        queryKey: ['active-alarms'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('machine_alarms')
                .select(`
                    *,
                    machine:machines(code, name)
                `)
                .is('resolved_at', null)
                .order('triggered_at', { ascending: false })

            if (error) throw error
            return data as (MachineAlarm & { machine: { code: string; name: string } })[]
        }
    })
}

// Acknowledge alarm
export function useAcknowledgeAlarm() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (alarmId: number) => {
            const { data, error } = await supabase
                .from('machine_alarms')
                .update({
                    acknowledged_at: new Date().toISOString()
                })
                .eq('id', alarmId)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['active-alarms'] })
            queryClient.invalidateQueries({ queryKey: ['machine-stats'] })
        }
    })
}

// Update machine status
export function useUpdateMachineStatus() {
    const supabase = createClient()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: Machine['status'] }) => {
            const { data, error } = await supabase
                .from('machines')
                .update({ status })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data as Machine
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['machines'] })
            queryClient.invalidateQueries({ queryKey: ['machine', data.id] })
            queryClient.invalidateQueries({ queryKey: ['machine-stats'] })
        }
    })
}
