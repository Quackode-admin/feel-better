import Link from 'next/link'
import { Mail, Users, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-[#191C18]">
          Panel de Administración
        </h1>
        <p className="mt-1 text-[13px] text-[#72796E]">
          Bienvenido al panel de control de Feel Better.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/invitations" className="group flex flex-col gap-3 rounded-xl border border-[#F3F4F6] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7E9E1]">
            <Mail size={20} className="text-[#2D5A27]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#191C18]">Invitaciones</h2>
            <p className="mt-1 text-[13px] text-[#72796E]">Gestiona las invitaciones enviadas a nutricionistas.</p>
          </div>
          <div className="mt-auto flex items-center gap-1 text-[12px] font-medium text-[#2D5A27]">
            Ver invitaciones <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
        <Link href="/nutritionists" className="group flex flex-col gap-3 rounded-xl border border-[#F3F4F6] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7E9E1]">
            <Users size={20} className="text-[#2D5A27]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-[#191C18]">Nutricionistas</h2>
            <p className="mt-1 text-[13px] text-[#72796E]">Administra el equipo de nutricionistas activos.</p>
          </div>
          <div className="mt-auto flex items-center gap-1 text-[12px] font-medium text-[#2D5A27]">
            Ver nutricionistas <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>
    </div>
  )
}
