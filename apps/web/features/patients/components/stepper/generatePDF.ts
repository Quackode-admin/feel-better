import jsPDF from 'jspdf'
import { StepperData } from './types'

// ── Feel Better DS Colors ──────────────────────────────────────────────────
const GREEN_950  = '#154212'
const GREEN_700  = '#2D5A27'
const GREEN_500  = '#9DD090'
const GREEN_100  = '#E7E9E1'
const GREEN_25   = '#F3F4ED'
const INK_900    = '#191C18'
const INK_700    = '#42493E'
const INK_500    = '#72796E'
const INK_400    = '#9CA3AF'
const WHITE      = '#FFFFFF'
const CREAM      = '#FAFAFA'

const PAGE_W = 210  // A4 mm
const PAGE_H = 297
const MARGIN = 14
const COL    = PAGE_W - MARGIN * 2

// ── Helpers ────────────────────────────────────────────────────────────────
function hex2rgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function setFill(doc: jsPDF, hex: string) { doc.setFillColor(...hex2rgb(hex)) }
function setDraw(doc: jsPDF, hex: string) { doc.setDrawColor(...hex2rgb(hex)) }
function setTextColor(doc: jsPDF, hex: string) { doc.setTextColor(...hex2rgb(hex)) }

function sectionHeader(doc: jsPDF, y: number, label: string): number {
  setFill(doc, GREEN_950)
  doc.rect(MARGIN, y, COL, 7, 'F')
  setTextColor(doc, WHITE)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text(label.toUpperCase(), MARGIN + 3, y + 5)
  return y + 7
}

function subHeader(doc: jsPDF, y: number, label: string): number {
  setFill(doc, GREEN_700)
  doc.rect(MARGIN, y, COL, 5.5, 'F')
  setTextColor(doc, GREEN_500)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text(label.toUpperCase(), MARGIN + 2, y + 4)
  return y + 5.5
}

function cell(doc: jsPDF, x: number, y: number, w: number, h: number, label: string, value: string, bg = CREAM) {
  setFill(doc, bg)
  setDraw(doc, GREEN_100)
  doc.rect(x, y, w, h, 'FD')

  setTextColor(doc, INK_500)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  doc.text(label.toUpperCase(), x + 2, y + 4)

  setTextColor(doc, INK_900)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  const lines = doc.splitTextToSize(value || '—', w - 4)
  doc.text(lines, x + 2, y + 8)
}

function textArea(doc: jsPDF, x: number, y: number, w: number, label: string, value: string): number {
  const lines = doc.splitTextToSize(value || '—', w - 4)
  const h = Math.max(14, lines.length * 4 + 8)

  setFill(doc, CREAM)
  setDraw(doc, GREEN_100)
  doc.rect(x, y, w, h, 'FD')

  setTextColor(doc, GREEN_700)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'bold')
  doc.text(label.toUpperCase(), x + 2, y + 4.5)

  setTextColor(doc, INK_700)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.text(lines, x + 2, y + 9)

  return y + h + 2
}

function pageHeader(doc: jsPDF, caseNumber: string, patientName: string, page: number, total: number) {
  // Logo area
  setFill(doc, GREEN_950)
  doc.rect(0, 0, 55, 14, 'F')
  setTextColor(doc, WHITE)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Feel Better', 5, 7)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.text('NUTRICIÓN · PORTAL PROFESIONAL', 5, 11.5)

  // Title
  setTextColor(doc, GREEN_950)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Resumen de cita', PAGE_W / 2, 8, { align: 'center' })

  // Case info
  setTextColor(doc, INK_500)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  const dateStr = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  doc.text(`CASO #${caseNumber}`, PAGE_W - MARGIN, 5, { align: 'right' })
  doc.text(patientName ? `${patientName} · ${dateStr}` : dateStr, PAGE_W - MARGIN, 9.5, { align: 'right' })

  // Divider
  setDraw(doc, GREEN_100)
  doc.setLineWidth(0.3)
  doc.line(0, 14, PAGE_W, 14)

  // Footer
  setFill(doc, GREEN_25)
  doc.rect(0, PAGE_H - 8, PAGE_W, 8, 'F')
  setTextColor(doc, INK_500)
  doc.setFontSize(6.5)
  doc.text('Feel Better Nutrición · Portal Profesional · © 2026', MARGIN, PAGE_H - 3.5)
  doc.text('● Documento confidencial', PAGE_W / 2, PAGE_H - 3.5, { align: 'center' })
  doc.text(`Página ${page} de ${total}`, PAGE_W - MARGIN, PAGE_H - 3.5, { align: 'right' })
}

// ── MAIN EXPORT ────────────────────────────────────────────────────────────
export async function generateConsultaPDF(data: StepperData, caseNumber: string): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  const fullName = [data.firstName, data.middleName, data.lastName, data.secondLastName].filter(Boolean).join(' ')
  const TOTAL_PAGES = 3

  // ──────────────────────────────────────────────────────────────────────────
  // PÁGINA 1 — Datos personales + Antecedentes + Estilo de vida
  // ──────────────────────────────────────────────────────────────────────────
  pageHeader(doc, caseNumber, fullName, 1, TOTAL_PAGES)
  let y = 17

  // Datos personales
  y = sectionHeader(doc, y, 'Datos personales del paciente')
  y += 1

  const col4 = COL / 4
  const row1h = 14
  cell(doc, MARGIN,              y, col4, row1h, 'Primer nombre',    data.firstName)
  cell(doc, MARGIN + col4,       y, col4, row1h, 'Segundo nombre',   data.middleName)
  cell(doc, MARGIN + col4 * 2,   y, col4, row1h, 'Primer apellido',  data.lastName)
  cell(doc, MARGIN + col4 * 3,   y, col4, row1h, 'Segundo apellido', data.secondLastName)
  y += row1h

  cell(doc, MARGIN,              y, col4, row1h, 'Doc. de identificación', data.dui)
  cell(doc, MARGIN + col4,       y, col4, row1h, 'Fecha de nacimiento',    data.birthDate ? new Date(data.birthDate).toLocaleDateString('es') : '—')
  cell(doc, MARGIN + col4 * 2,   y, col4, row1h, 'Número de contacto',     data.phone)
  cell(doc, MARGIN + col4 * 3,   y, col4, row1h, 'Sexo',                   data.sex)
  y += row1h

  cell(doc, MARGIN,              y, col4 * 2, row1h, 'Correo electrónico', data.email)
  cell(doc, MARGIN + col4 * 2,   y, col4,     row1h, 'Estado civil',        data.maritalStatus)
  y += row1h + 3

  // Antecedentes
  y = sectionHeader(doc, y, 'Antecedentes de enfermedades')
  y += 1
  y = textArea(doc, MARGIN, y, COL, '¿Ha padecido o padece alguna enfermedad crónica?', data.chronicDiseases)
  y = textArea(doc, MARGIN, y, COL, '¿Padece alguna otra enfermedad no crónica?',        data.nonChronicDiseases)
  y = textArea(doc, MARGIN, y, COL, '¿Ha recibido o se encuentra recibiendo algún tratamiento médico?', data.medicalTreatments)
  y += 2

  // Estilo de vida
  y = sectionHeader(doc, y, 'Estilo de vida')
  y += 1

  const col2 = COL / 2
  const y0 = y
  y = textArea(doc, MARGIN,         y, col2 - 1, 'Rutina de sueño',  data.sleepRoutine)
  const y1 = textArea(doc, MARGIN + col2 + 1, y0, col2 - 1, 'Actividad física', data.physicalActivity)
  y = Math.max(y, y1)

  cell(doc, MARGIN,         y, col2 - 1, 14, 'Intolerancias alimentarias', data.foodIntolerances)
  cell(doc, MARGIN + col2 + 1, y, col2 - 1, 14, 'Alimentos que no le gustan', data.dislikedFoods)
  y += 14

  // Hábitos
  const habits = [
    data.smokes === 'si' ? 'Fuma' : 'No fuma',
    data.drinksAlcohol === 'si' ? 'Consume alcohol' : 'No consume alcohol',
  ].join('  ·  ')
  cell(doc, MARGIN, y, COL, 10, 'Hábitos', habits)
  y += 10 + 2

  // Dieta habitual
  y = subHeader(doc, y, 'Dieta habitual de referencia')
  y += 1

  // Tabla dieta
  const dcols: number[] = [30, (COL - 30) / 2, (COL - 30) / 2]
  const headers = ['', 'Días de semana', 'Fines de semana']
  const rowsD  = ['breakfast', 'lunch', 'dinner', 'snacks', 'liquids']
  const rowLabels = ['Desayuno', 'Almuerzo', 'Cena', 'Refrigerios', 'Líquidos']

  // Header fila
  setFill(doc, GREEN_100)
  doc.rect(MARGIN, y, COL, 6, 'F')
  let cx = MARGIN
  headers.forEach((h, i) => {
    setDraw(doc, GREEN_100)
    doc.rect(cx, y, dcols[i]!, 6, 'D')
    setTextColor(doc, INK_500)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    if (h) doc.text(h.toUpperCase(), cx + 2, y + 4)
    cx += dcols[i]!
  })
  y += 6

  rowsD.forEach((key, idx) => {
    const rowH = 9
    cx = MARGIN
    const wdVal = data.dietWeekdays[key as keyof typeof data.dietWeekdays] || '—'
    const weVal = data.dietWeekends[key as keyof typeof data.dietWeekends] || '—'
    ;[rowLabels[idx], wdVal, weVal].forEach((val, i) => {
      const bg = i === 0 ? GREEN_25 : WHITE
      setFill(doc, bg); setDraw(doc, GREEN_100)
      doc.rect(cx, y, dcols[i]!, rowH, 'FD')
      setTextColor(doc, i === 0 ? INK_700 : INK_900)
      doc.setFontSize(7)
      doc.setFont('helvetica', i === 0 ? 'bold' : 'normal')
      doc.text(val, cx + 2, y + 5.5)
      cx += dcols[i]!
    })
    y += rowH
  })

  // ──────────────────────────────────────────────────────────────────────────
  // PÁGINA 2 — Medidas + Motivación + Próxima cita
  // ──────────────────────────────────────────────────────────────────────────
  doc.addPage()
  pageHeader(doc, caseNumber, fullName, 2, TOTAL_PAGES)
  y = 17

  y = sectionHeader(doc, y, 'Estado actual y evolución de medidas')
  y += 1

  // Tabla medidas
  const mcols: number[] = [30, 25, 30, 30, 28, 28]
  const mHeaders = ['Medida', 'Meta', 'Anterior', 'Actual · hoy', 'Δ vs anterior', 'Δ total']
  const MEASURES_PDF = [
    { key: 'weight', label: 'Peso (kg)' },
    { key: 'height', label: 'Talla (m)' },
    { key: 'waist',  label: 'Cintura (cm)' },
    { key: 'hip',    label: 'Cadera (cm)' },
    { key: 'arm',    label: 'Brazo (cm)' },
    { key: 'chest',  label: 'Pecho (cm)' },
    { key: 'thigh',  label: 'Muslo (cm)' },
    { key: 'bmi',    label: 'IMC' },
  ]

  setFill(doc, GREEN_100); doc.rect(MARGIN, y, COL, 6, 'F')
  cx = MARGIN
  mHeaders.forEach((h, i) => {
    setDraw(doc, GREEN_100); doc.rect(cx, y, mcols[i]!, 6, 'D')
    setTextColor(doc, INK_500); doc.setFontSize(6); doc.setFont('helvetica', 'bold')
    doc.text(h.toUpperCase(), cx + 1.5, y + 4)
    cx += mcols[i]!
  })
  y += 6

  MEASURES_PDF.forEach(({ key, label }) => {
    const m = data.measures[key as keyof typeof data.measures]
    const prev = m.previous ? parseFloat(m.previous) : null
    const curr = m.current  ? parseFloat(m.current)  : null
    const init = m.previous ? parseFloat(m.previous) : null
    const diff = prev && curr ? curr - prev : null
    const diffTotal = init && curr ? curr - init : null

    const rowH = 7
    cx = MARGIN
    const vals = [
      label,
      m.goal || '—',
      m.previous || '—',
      m.current || '—',
      diff !== null ? (diff < 0 ? `▼ ${Math.abs(diff).toFixed(1)}` : `▲ ${diff.toFixed(1)}`) : '—',
      diffTotal !== null ? (diffTotal < 0 ? `▼ ${Math.abs(diffTotal).toFixed(1)}` : `▲ ${diffTotal.toFixed(1)}`) : '—',
    ]
    vals.forEach((val, i) => {
      const isTrend = i >= 4
      const bg = i === 0 ? GREEN_25 : WHITE
      setFill(doc, bg); setDraw(doc, GREEN_100)
      doc.rect(cx, y, mcols[i]!, rowH, 'FD')
      const color = isTrend && val.startsWith('▼') ? '#2D7A3A' : isTrend && val.startsWith('▲') ? '#C0392B' : i === 0 ? INK_700 : INK_900
      setTextColor(doc, color)
      doc.setFontSize(7.5); doc.setFont('helvetica', i === 0 ? 'bold' : 'normal')
      doc.text(val, cx + 1.5, y + 5)
      cx += mcols[i]!
    })
    y += rowH
  })
  y += 3

  // Motivación + Asesoría
  y = sectionHeader(doc, y, 'Motivación y asesoría personalizada')
  y += 1

  const leftW  = COL / 2 - 1
  const rightW = COL / 2 - 1
  const leftX  = MARGIN
  const rightX = MARGIN + leftW + 2

  // Feature card izquierda
  setFill(doc, GREEN_700); doc.rect(leftX, y, leftW, 40, 'F')
  // Círculo decorativo
  setFill(doc, 'rgba(255,255,255,0.08)')
  doc.setFillColor(255, 255, 255, 0.08 as any)
  doc.circle(leftX + leftW - 5, y + 35, 12, 'F')

  setTextColor(doc, GREEN_500); doc.setFontSize(6); doc.setFont('helvetica', 'bold')
  doc.text('MOTIVACIÓN PRINCIPAL', leftX + 3, y + 6)
  setTextColor(doc, WHITE); doc.setFontSize(8); doc.setFont('helvetica', 'normal')
  const motLines = doc.splitTextToSize(data.motivation || '—', leftW - 6)
  doc.text(motLines, leftX + 3, y + 11)

  y = textArea(doc, rightX, y, rightW, 'Asesoría personalizada', data.personalizedAdvice)
  y += 3

  // Próxima cita
  y = sectionHeader(doc, y, 'Próxima cita')
  y += 1

  setFill(doc, GREEN_950); doc.rect(MARGIN, y, COL, 18, 'F')
  setTextColor(doc, GREEN_500); doc.setFontSize(6); doc.setFont('helvetica', 'bold')
  doc.text('FECHA PROGRAMADA', MARGIN + 3, y + 5)
  setTextColor(doc, WHITE); doc.setFontSize(11); doc.setFont('helvetica', 'bold')
  const apptDate = data.nextAppointment
    ? new Date(data.nextAppointment).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '—'
  doc.text(apptDate.charAt(0).toUpperCase() + apptDate.slice(1), MARGIN + 3, y + 13)
  y += 18 + 3

  // ──────────────────────────────────────────────────────────────────────────
  // PÁGINA 3 — Plan alimenticio semanal
  // ──────────────────────────────────────────────────────────────────────────
  doc.addPage()
  pageHeader(doc, caseNumber, fullName, 3, TOTAL_PAGES)
  y = 17

  const monthYear = data.nextAppointment
    ? new Date(data.nextAppointment).toLocaleDateString('es', { month: 'long', year: 'numeric' }).toUpperCase()
    : new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' }).toUpperCase()

  y = sectionHeader(doc, y, `Plan de alimentación semanal — ${monthYear}`)
  y += 1

  // Chips de intolerancias
  if (data.foodIntolerances) {
    const chips = data.foodIntolerances.split(',').map((s) => s.trim()).filter(Boolean)
    setTextColor(doc, INK_500); doc.setFontSize(6.5); doc.setFont('helvetica', 'bold')
    doc.text('Sin: ', MARGIN, y + 3.5)
    let chipX = MARGIN + 8
    chips.forEach((chip) => {
      setFill(doc, GREEN_100); setDraw(doc, GREEN_100)
      const w = doc.getTextWidth(chip) + 5
      doc.roundedRect(chipX, y, w, 5, 1, 1, 'FD')
      setTextColor(doc, GREEN_700); doc.setFont('helvetica', 'normal')
      doc.text(chip, chipX + 2.5, y + 3.5)
      chipX += w + 2
    })
    y += 7
  }

  // Tabla plan alimenticio
  const days = ['LUNES', 'MARTES', 'MIÉRC.', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO']
  const mealCols = ['Desayuno', 'Almuerzo', 'Cena', 'Meriendas']
  const planCols: number[] = [16, (COL - 16) / 4, (COL - 16) / 4, (COL - 16) / 4, (COL - 16) / 4]

  // Header
  setFill(doc, GREEN_950); doc.rect(MARGIN, y, COL, 7, 'F')
  cx = MARGIN
  ;['', ...mealCols].forEach((h, i) => {
    setDraw(doc, GREEN_700); doc.rect(cx, y, planCols[i]!, 7, 'D')
    setTextColor(doc, WHITE); doc.setFontSize(6.5); doc.setFont('helvetica', 'bold')
    if (h) doc.text(h.toUpperCase(), cx + 1.5, y + 4.5)
    cx += planCols[i]!
  })
  y += 7

  data.mealPlan.forEach((row, idx) => {
    const rowValues = [row.breakfast, row.lunch, row.dinner, row.snacks]
    const maxLines = Math.max(...rowValues.map((v) =>
      doc.splitTextToSize(v || ' ', planCols[1] - 3).length
    ))
    const rowH = Math.max(10, maxLines * 3.5 + 4)

    cx = MARGIN
    // Día
    setFill(doc, GREEN_25); setDraw(doc, GREEN_100)
    doc.rect(cx, y, planCols[0], rowH, 'FD')
    setTextColor(doc, GREEN_950); doc.setFontSize(6.5); doc.setFont('helvetica', 'bold')
    doc.text(days[idx], cx + 1.5, y + rowH / 2 + 1.5)
    cx += planCols[0]

    rowValues.forEach((val, i) => {
      setFill(doc, i % 2 === 0 ? WHITE : CREAM); setDraw(doc, GREEN_100)
      doc.rect(cx, y, planCols[i + 1], rowH, 'FD')
      setTextColor(doc, INK_700); doc.setFontSize(7); doc.setFont('helvetica', 'normal')
      const lines = doc.splitTextToSize(val || '—', planCols[i + 1] - 3)
      doc.text(lines, cx + 1.5, y + 4)
      cx += planCols[i + 1]
    })
    y += rowH
  })
  y += 4

  // Notas finales
  if (data.foodIntolerances || data.personalizedAdvice) {
    const notesCols = 3
    const noteW = COL / notesCols - 1
    const notes = [
      { title: 'HIDRATACIÓN', body: 'Mínimo 3 L de agua al día.' },
      data.foodIntolerances ? { title: `SIN: ${data.foodIntolerances.split(',')[0]?.toUpperCase()}`, body: data.foodIntolerances } : null,
      data.personalizedAdvice ? { title: 'ACTIVIDAD FÍSICA SUGERIDA', body: data.personalizedAdvice.slice(0, 120), highlight: true } : null,
    ].filter(Boolean) as { title: string; body: string; highlight?: boolean }[]

    notes.slice(0, 3).forEach((note, i) => {
      const nx = MARGIN + i * (noteW + 1)
      const bg = note.highlight ? GREEN_700 : CREAM
      const border = note.highlight ? GREEN_500 : GREEN_200
      setFill(doc, bg); setDraw(doc, border)
      doc.rect(nx, y, noteW, 20, 'FD')
      setTextColor(doc, note.highlight ? GREEN_500 : GREEN_700)
      doc.setFontSize(6.5); doc.setFont('helvetica', 'bold')
      doc.text(note.title, nx + 2, y + 5)
      setTextColor(doc, note.highlight ? WHITE : INK_700)
      doc.setFontSize(7); doc.setFont('helvetica', 'normal')
      const bLines = doc.splitTextToSize(note.body, noteW - 4)
      doc.text(bLines.slice(0, 4), nx + 2, y + 10)
    })
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const filename = `feel-better-consulta-${caseNumber}-${fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`
  doc.save(filename)
}
