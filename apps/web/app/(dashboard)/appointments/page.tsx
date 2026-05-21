'use client'

import { useState } from 'react'
import { AppointmentList } from '@/features/appointments/components/AppointmentList'
import { CreateAppointmentForm } from '@/features/appointments/components/CreateAppointmentForm'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CalendarPlus } from 'lucide-react'

export default function AppointmentsPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--green-950)', letterSpacing: '-0.02em' }}>
            Citas
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--ink-500)' }}>
            Agenda y gestiona las citas con tus pacientes
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2"
              style={{ backgroundColor: 'var(--green-950)', color: 'white' }}
            >
              <CalendarPlus size={16} />
              Nueva cita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold" style={{ color: 'var(--green-950)' }}>
                Agendar nueva cita
              </DialogTitle>
            </DialogHeader>
            <CreateAppointmentForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <AppointmentList />
    </div>
  )
}
