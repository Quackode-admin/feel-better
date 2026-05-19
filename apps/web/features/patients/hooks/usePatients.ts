'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import { getPatientsApi, createPatientApi, getPatientByIdApi } from '../api/patients.api'

export function usePatients() {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const token = await getToken()
      return getPatientsApi(token!)
    },
  })
}

export function usePatient(id: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['patients', id],
    queryFn: async () => {
      const token = await getToken()
      return getPatientByIdApi(token!, id)
    },
    enabled: Boolean(id),
  })
}

export function useCreatePatient() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: any) => {
      const token = await getToken()
      return createPatientApi(token!, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      toast.success('Paciente creado correctamente')
    },
    onError: (error: any) => {
      toast.error(error.message ?? 'Error creando paciente')
    },
  })
}
