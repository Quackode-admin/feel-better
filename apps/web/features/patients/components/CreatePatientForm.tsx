'use client'

import { useState } from 'react'
import { useCreatePatient } from '../hooks/usePatients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

// Base de datos de alergias comunes (alimentarias y médicas)
const ALLERGIES_DB = [
  // Alimentarias — Big 9 (FDA)
  { id: 'milk', label: 'Leche / Lácteos', category: 'Alimentaria' },
  { id: 'eggs', label: 'Huevo', category: 'Alimentaria' },
  { id: 'peanuts', label: 'Maní / Cacahuate', category: 'Alimentaria' },
  { id: 'tree_nuts', label: 'Nueces y frutos secos', category: 'Alimentaria' },
  { id: 'almonds', label: 'Almendras', category: 'Alimentaria' },
  { id: 'walnuts', label: 'Nueces', category: 'Alimentaria' },
  { id: 'cashews', label: 'Anacardos / Cashews', category: 'Alimentaria' },
  { id: 'pistachios', label: 'Pistachos', category: 'Alimentaria' },
  { id: 'fish', label: 'Pescado', category: 'Alimentaria' },
  { id: 'shellfish', label: 'Mariscos / Crustáceos', category: 'Alimentaria' },
  { id: 'shrimp', label: 'Camarón', category: 'Alimentaria' },
  { id: 'wheat', label: 'Trigo / Gluten', category: 'Alimentaria' },
  { id: 'soy', label: 'Soya', category: 'Alimentaria' },
  { id: 'sesame', label: 'Ajonjolí / Sésamo', category: 'Alimentaria' },
  { id: 'corn', label: 'Maíz', category: 'Alimentaria' },
  { id: 'strawberry', label: 'Fresa / Frutilla', category: 'Alimentaria' },
  { id: 'tomato', label: 'Tomate', category: 'Alimentaria' },
  { id: 'chocolate', label: 'Chocolate / Cacao', category: 'Alimentaria' },
  { id: 'citrus', label: 'Cítricos (naranja, limón)', category: 'Alimentaria' },
  { id: 'avocado', label: 'Aguacate / Palta', category: 'Alimentaria' },
  // Médicas / Ambientales
  { id: 'penicillin', label: 'Penicilina', category: 'Medicamento' },
  { id: 'aspirin', label: 'Aspirina / AINEs', category: 'Medicamento' },
  { id: 'sulfa', label: 'Sulfonamidas', category: 'Medicamento' },
  { id: 'ibuprofen', label: 'Ibuprofeno', category: 'Medicamento' },
  { id: 'latex', label: 'Látex', category: 'Ambiental' },
  { id: 'pollen', label: 'Polen', category: 'Ambiental' },
  { id: 'dust', label: 'Polvo / Ácaros', category: 'Ambiental' },
  { id: 'animal_dander', label: 'Pelo de animales', category: 'Ambiental' },
  { id: 'bee_sting', label: 'Picadura de abeja', category: 'Ambiental' },
  { id: 'nickel', label: 'Níquel', category: 'Ambiental' },
]

const CATEGORIES = ['Alimentaria', 'Medicamento', 'Ambiental']

interface CreatePatientFormProps {
  onSuccess?: () => void
}

export function CreatePatientForm({ onSuccess }: CreatePatientFormProps) {
  const { mutate: createPatient, isPending } = useCreatePatient()
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    phone: '',
    birthDate: '',
    heightCm: '',
    initialWeightKg: '',
    targetWeightKg: '',
    medicalNotes: '',
  })
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [customAllergy, setCustomAllergy] = useState('')
  const [customAllergies, setCustomAllergies] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('Alimentaria')
  const [notesCount, setNotesCount] = useState(0)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    if (name === 'phone') {
      // Formato XXXX-XXXX
      const digits = value.replace(/\D/g, '').slice(0, 8)
      const formatted = digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits
      setForm((prev) => ({ ...prev, phone: formatted }))
      return
    }
    if (name === 'medicalNotes') {
      if (value.length > 650) return
      setNotesCount(value.length)
    }
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function toggleAllergy(id: string) {
    setSelectedAllergies((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
  }

  function addCustomAllergy() {
    const trimmed = customAllergy.trim()
    if (!trimmed || customAllergies.includes(trimmed)) return
    setCustomAllergies((prev) => [...prev, trimmed])
    setCustomAllergy('')
  }

  function removeCustomAllergy(allergy: string) {
    setCustomAllergies((prev) => prev.filter((a) => a !== allergy))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const fullName = [form.firstName, form.middleName, form.lastName, form.secondLastName]
      .filter(Boolean)
      .join(' ')

    const allergyLabels = [
      ...selectedAllergies.map((id) => ALLERGIES_DB.find((a) => a.id === id)?.label ?? id),
      ...customAllergies,
    ]

    createPatient({
      fullName,
      email: form.email,
      phone: form.phone,
      birthDate: form.birthDate,
      heightCm: form.heightCm ? parseFloat(form.heightCm) : undefined,
      initialWeightKg: form.initialWeightKg ? parseFloat(form.initialWeightKg) : undefined,
      targetWeightKg: form.targetWeightKg ? parseFloat(form.targetWeightKg) : undefined,
      allergies: allergyLabels.join(', '),
      medicalNotes: form.medicalNotes,
    })
    onSuccess?.()
  }

  const filteredAllergies = ALLERGIES_DB.filter((a) => a.category === activeCategory)

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Nombre */}
      <div>
        <p className="text-sm font-medium mb-3">Nombre completo</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="firstName">Primer nombre *</Label>
            <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="middleName">Segundo nombre</Label>
            <Input id="middleName" name="middleName" value={form.middleName} onChange={handleChange} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Primer apellido *</Label>
            <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="secondLastName">Segundo apellido</Label>
            <Input id="secondLastName" name="secondLastName" value={form.secondLastName} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Teléfono (XXXX-XXXX)</Label>
          <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="0000-0000" maxLength={9} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <Input id="birthDate" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
        </div>
      </div>

      {/* Datos clínicos */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="heightCm">Altura (cm)</Label>
          <Input id="heightCm" name="heightCm" type="number" value={form.heightCm} onChange={handleChange} placeholder="165" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="initialWeightKg">Peso inicial (kg)</Label>
          <Input id="initialWeightKg" name="initialWeightKg" type="number" value={form.initialWeightKg} onChange={handleChange} placeholder="70" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="targetWeightKg">Peso objetivo (kg)</Label>
          <Input id="targetWeightKg" name="targetWeightKg" type="number" value={form.targetWeightKg} onChange={handleChange} placeholder="65" />
        </div>
      </div>

      {/* Alergias */}
      <div>
        <p className="text-sm font-medium mb-2">Alergias</p>

        {/* Categorías */}
        <div className="flex gap-2 mb-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de alergias */}
        <div className="flex flex-wrap gap-2 mb-3 max-h-32 overflow-y-auto p-2 border rounded-lg bg-muted/20">
          {filteredAllergies.map((allergy) => (
            <button
              key={allergy.id}
              type="button"
              onClick={() => toggleAllergy(allergy.id)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                selectedAllergies.includes(allergy.id)
                  ? 'bg-destructive/10 text-destructive border-destructive/50 font-medium'
                  : 'bg-background border-border text-muted-foreground hover:border-primary'
              }`}
            >
              {allergy.label}
            </button>
          ))}
        </div>

        {/* Seleccionadas */}
        {(selectedAllergies.length > 0 || customAllergies.length > 0) && (
          <div className="flex flex-wrap gap-1 mb-2">
            {selectedAllergies.map((id) => {
              const label = ALLERGIES_DB.find((a) => a.id === id)?.label ?? id
              return (
                <Badge key={id} variant="destructive" className="text-xs cursor-pointer" onClick={() => toggleAllergy(id)}>
                  {label} ×
                </Badge>
              )
            })}
            {customAllergies.map((allergy) => (
              <Badge key={allergy} variant="outline" className="text-xs cursor-pointer border-destructive text-destructive" onClick={() => removeCustomAllergy(allergy)}>
                {allergy} ×
              </Badge>
            ))}
          </div>
        )}

        {/* Agregar otra */}
        <div className="flex gap-2">
          <Input
            value={customAllergy}
            onChange={(e) => setCustomAllergy(e.target.value)}
            placeholder="Agregar otra alergia..."
            className="text-sm"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomAllergy() } }}
          />
          <Button type="button" variant="outline" size="sm" onClick={addCustomAllergy}>
            Agregar
          </Button>
        </div>
      </div>

      {/* Notas médicas */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="medicalNotes">Notas médicas</Label>
          <span className={`text-xs ${notesCount > 600 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {notesCount}/650
          </span>
        </div>
        <Textarea
          id="medicalNotes"
          name="medicalNotes"
          value={form.medicalNotes}
          onChange={handleChange}
          rows={3}
          placeholder="Información clínica relevante..."
          maxLength={650}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Guardando...' : 'Crear paciente'}
        </Button>
      </div>
    </form>
  )
}
