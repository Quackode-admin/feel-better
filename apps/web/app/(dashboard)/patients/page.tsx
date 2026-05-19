'use client'

import { useState } from 'react'
import { PatientList } from '@/features/patients/components/PatientList'
import { CreatePatientForm } from '@/features/patients/components/CreatePatientForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserPlus } from 'lucide-react'

export default function PatientsPage() {
  const [open, setOpen] = useState(false)

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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2"
              style={{ backgroundColor: 'var(--green-950)', color: 'white' }}
            >
              <UserPlus size={16} />
              Nuevo paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle
                className="text-lg font-bold"
                style={{ color: 'var(--green-950)' }}
              >
                Crear nuevo paciente
              </DialogTitle>
            </DialogHeader>
            <CreatePatientForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <PatientList />
    </div>
  )
}
