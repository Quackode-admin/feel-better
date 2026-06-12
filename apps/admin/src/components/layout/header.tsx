'use client'

import { Search, Bell } from 'lucide-react'
import { useState } from 'react'

const tabs = ['Overview', 'Reportes', 'Ayuda']

export function Header() {
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-[#F3F4F6] bg-white px-6">
      <div className="flex items-center gap-1" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              activeTab === tab
                ? 'bg-[#154212] text-white'
                : 'text-[#72796E] hover:bg-[#F3F4F6]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2 rounded-lg border border-[#F3F4F6] bg-[#FAFAFA] px-3 py-1.5 w-52">
        <Search size={14} className="text-[#9CA3AF]" aria-hidden="true" />
        <input
          type="search"
          placeholder="Buscar..."
          className="flex-1 bg-transparent text-[13px] text-[#191C18] placeholder:text-[#9CA3AF] outline-none"
          aria-label="Buscar en el panel"
        />
      </div>

      <button
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#F3F4F6] bg-white text-[#72796E] hover:bg-[#FAFAFA] transition-colors"
        aria-label="Notificaciones"
      >
        <Bell size={15} aria-hidden="true" />
      </button>
    </header>
  )
}
