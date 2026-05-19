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

export default function PatientsPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Pacientes</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gestiona tus pacientes y su información clínica
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Nuevo paciente</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear nuevo paciente</DialogTitle>
            </DialogHeader>
            <CreatePatientForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <PatientList />
    </div>
  )
}
