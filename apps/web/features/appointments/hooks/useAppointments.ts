'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import { getAppointmentsApi, createAppointmentApi, updateAppointmentApi } from '../api/appointments.api'

export function useAppointments() {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const token = await getToken()
      return getAppointmentsApi(token!)
    },
  })
}

export function useCreateAppointment() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const token = await getToken()
      return createAppointmentApi(token!, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Cita agendada correctamente')
    },
    onError: (error: any) => toast.error(error.message ?? 'Error agendando cita'),
  })
}

export function useUpdateAppointment() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const token = await getToken()
      return updateAppointmentApi(token!, id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Cita actualizada')
    },
    onError: (error: any) => toast.error(error.message ?? 'Error actualizando cita'),
  })
}
