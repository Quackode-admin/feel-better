'use client'

import { usePatients } from '../hooks/usePatients'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export function PatientList() {
  const { data: patients, isLoading, isError } = usePatients()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-sm text-destructive">
        No se pudieron cargar los pacientes
      </div>
    )
  }

  if (!patients?.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No hay pacientes registrados aún</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {patients.map((patient: any) => (
        <Link
          key={patient.id}
          href={`/patients/${patient.id}`}
          className="flex items-center justify-between rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
              {patient.user?.profile?.fullName?.charAt(0) ?? '?'}
            </div>
            <div>
              <p className="font-medium">{patient.user?.profile?.fullName}</p>
              <p className="text-sm text-muted-foreground">{patient.user?.email}</p>
            </div>
          </div>
          <Badge variant={patient.user?.isActive ? 'default' : 'secondary'}>
            {patient.user?.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
