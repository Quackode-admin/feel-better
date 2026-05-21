'use client'

import { PatientList } from '@/features/patients/components/PatientList'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PatientsPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--green-950)', letterSpacing: '-0.02em' }}>
            Pacientes
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-500)' }}>
            Gestiona tus pacientes y su información clínica
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          style={{ backgroundColor: 'var(--green-950)', color: 'white' }}
          onClick={() => router.push('/patients/new')}
        >
          <UserPlus size={16} />
          Nueva consulta
        </Button>
      </div>
      <PatientList />
    </div>
  )
}
