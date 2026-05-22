import jsPDF from 'jspdf'
import { StepperData } from './types'

const G950 = '#154212'
const G700 = '#2D5A27'
const G500 = '#9DD090'
const G200 = '#C2C9BB'
const G100 = '#E7E9E1'
const G25  = '#F3F4ED'
const I900 = '#191C18'
const I700 = '#42493E'
const I500 = '#72796E'
const WHT  = '#FFFFFF'
const CRM  = '#FAFAFA'
const PW   = 210
const PH   = 297
const MG   = 14
const COL  = PW - MG * 2

function rgb(h: string): [number, number, number] {
  return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]
}
function sf(d: jsPDF, h: string) { d.setFillColor(...rgb(h)) }
function sd(d: jsPDF, h: string) { d.setDrawColor(...rgb(h)) }
function st(d: jsPDF, h: string) { d.setTextColor(...rgb(h)) }

function secHead(d: jsPDF, y: number, lbl: string): number {
  sf(d,G950); d.rect(MG,y,COL,7,'F')
  st(d,WHT); d.setFontSize(8); d.setFont('helvetica','bold')
  d.text(lbl.toUpperCase(), MG+3, y+5)
  return y+7
}

function txtBlock(d: jsPDF, x: number, y: number, w: number, lbl: string, val: string): number {
  const v = val||'—'
  const lines = d.splitTextToSize(v, w-4) as string[]
  const h = Math.max(14, lines.length*4+8)
  sf(d,CRM); sd(d,G100); d.rect(x,y,w,h,'FD')
  st(d,G700); d.setFontSize(6.5); d.setFont('helvetica','bold')
  d.text(lbl.toUpperCase(), x+2, y+4.5)
  st(d,I700); d.setFontSize(7.5); d.setFont('helvetica','normal')
  d.text(lines, x+2, y+9)
  return y+h+2
}

function dCell(d: jsPDF, x: number, y: number, w: number, h: number, lbl: string, val: string, bg=CRM) {
  sf(d,bg); sd(d,G100); d.rect(x,y,w,h,'FD')
  st(d,I500); d.setFontSize(6); d.setFont('helvetica','bold')
  d.text(lbl.toUpperCase(), x+2, y+4)
  st(d,I900); d.setFontSize(8); d.setFont('helvetica','normal')
  const lines = d.splitTextToSize(val||'—', w-4) as string[]
  d.text(lines, x+2, y+8)
}

function pgHead(d: jsPDF, cas: string, nm: string, pg: number, tot: number) {
  sf(d,G950); d.rect(0,0,55,14,'F')
  st(d,WHT); d.setFontSize(11); d.setFont('helvetica','bold'); d.text('Feel Better',5,7)
  d.setFontSize(6.5); d.setFont('helvetica','normal'); d.text('NUTRICIÓN · PORTAL PROFESIONAL',5,11.5)
  st(d,G950); d.setFontSize(14); d.setFont('helvetica','bold')
  d.text('Resumen de cita', PW/2, 8, {align:'center'})
  st(d,I500); d.setFontSize(7); d.setFont('helvetica','normal')
  const dt = new Date().toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
  d.text(`CASO #${cas}`, PW-MG, 5, {align:'right'})
  d.text(nm ? `${nm} · ${dt}` : dt, PW-MG, 9.5, {align:'right'})
  sd(d,G100); d.setLineWidth(0.3); d.line(0,14,PW,14)
  sf(d,G25); d.rect(0,PH-8,PW,8,'F')
  st(d,I500); d.setFontSize(6.5)
  d.text('Feel Better Nutrición · Portal Profesional · © 2026', MG, PH-3.5)
  d.text('● Documento confidencial', PW/2, PH-3.5, {align:'center'})
  d.text(`Página ${pg} de ${tot}`, PW-MG, PH-3.5, {align:'right'})
}

export async function generateConsultaPDF(data: StepperData, caseNumber: string): Promise<void> {
  const doc = new jsPDF({unit:'mm',format:'a4',orientation:'portrait'})
  const nm = [data.firstName,data.middleName,data.lastName,data.secondLastName].filter(Boolean).join(' ')
  const TOT = 3

  pgHead(doc, caseNumber, nm, 1, TOT)
  let y = 17

  y = secHead(doc, y, 'Datos personales del paciente')
  y += 1
  const c4 = COL/4; const rh = 14
  dCell(doc,MG,         y,c4,rh,'Primer nombre',   data.firstName)
  dCell(doc,MG+c4,      y,c4,rh,'Segundo nombre',  data.middleName)
  dCell(doc,MG+c4*2,    y,c4,rh,'Primer apellido', data.lastName)
  dCell(doc,MG+c4*3,    y,c4,rh,'Segundo apellido',data.secondLastName)
  y += rh
  dCell(doc,MG,         y,c4,rh,'Doc. identificación', data.dui)
  dCell(doc,MG+c4,      y,c4,rh,'Fecha nacimiento', data.birthDate ? new Date(data.birthDate).toLocaleDateString('es') : '—')
  dCell(doc,MG+c4*2,    y,c4,rh,'Número contacto',  data.phone)
  dCell(doc,MG+c4*3,    y,c4,rh,'Sexo',             data.sex)
  y += rh
  dCell(doc,MG,         y,c4*2,rh,'Correo electrónico', data.email)
  dCell(doc,MG+c4*2,    y,c4,  rh,'Estado civil',       data.maritalStatus)
  y += rh+3

  y = secHead(doc, y, 'Antecedentes de enfermedades')
  y += 1
  y = txtBlock(doc,MG,y,COL,'¿Ha padecido o padece alguna enfermedad crónica?',                data.chronicDiseases)
  y = txtBlock(doc,MG,y,COL,'¿Padece alguna otra enfermedad no crónica?',                      data.nonChronicDiseases)
  y = txtBlock(doc,MG,y,COL,'¿Ha recibido algún tratamiento médico?',                          data.medicalTreatments)
  y += 2

  y = secHead(doc, y, 'Estilo de vida')
  y += 1
  const c2 = COL/2
  const y0 = y
  const yl = txtBlock(doc,MG,        y0,c2-1,'Rutina de sueño',  data.sleepRoutine)
  const yr = txtBlock(doc,MG+c2+1,   y0,c2-1,'Actividad física', data.physicalActivity)
  y = Math.max(yl,yr)
  dCell(doc,MG,       y,c2-1,14,'Intolerancias alimentarias', data.foodIntolerances)
  dCell(doc,MG+c2+1,  y,c2-1,14,'Alimentos que no le gustan', data.dislikedFoods)
  y += 14
  const hb = [data.smokes==='si'?'Fuma':'No fuma', data.drinksAlcohol==='si'?'Consume alcohol':'No consume alcohol'].join('  ·  ')
  dCell(doc,MG,y,COL,10,'Hábitos',hb)
  y += 10+2

  sf(doc,G700); doc.rect(MG,y,COL,5.5,'F')
  st(doc,G500); doc.setFontSize(7); doc.setFont('helvetica','bold')
  doc.text('DIETA HABITUAL DE REFERENCIA', MG+2, y+4)
  y += 6

  const dc: number[] = [30,(COL-30)/2,(COL-30)/2]
  const dh: string[] = ['','Días de semana','Fines de semana']
  const dr: string[] = ['breakfast','lunch','dinner','snacks','liquids']
  const dl: string[] = ['Desayuno','Almuerzo','Cena','Refrigerios','Líquidos']

  sf(doc,G100); doc.rect(MG,y,COL,6,'F')
  let cx = MG
  dh.forEach((h,i) => {
    const w = dc[i] as number
    sd(doc,G100); doc.rect(cx,y,w,6,'D')
    if(h){st(doc,I500);doc.setFontSize(6.5);doc.setFont('helvetica','bold');doc.text(h.toUpperCase(),cx+2,y+4)}
    cx += w
  })
  y += 6

  dr.forEach((key,idx) => {
    const rH=9; cx=MG
    const wd = (data.dietWeekdays as Record<string,string>)[key] ?? '—'
    const we = (data.dietWeekends as Record<string,string>)[key] ?? '—'
    const rv: string[] = [dl[idx] as string, wd, we]
    rv.forEach((val,i) => {
      const w = dc[i] as number
      sf(doc,i===0?G25:WHT); sd(doc,G100); doc.rect(cx,y,w,rH,'FD')
      st(doc,i===0?I700:I900); doc.setFontSize(7); doc.setFont('helvetica',i===0?'bold':'normal')
      doc.text(val,cx+2,y+5.5)
      cx += w
    })
    y += rH
  })

  doc.addPage()
  pgHead(doc,caseNumber,nm,2,TOT)
  y = 17

  y = secHead(doc,y,'Estado actual y evolución de medidas')
  y += 1
  const mc: number[] = [30,25,30,30,28,28]
  const mh: string[] = ['Medida','Meta','Anterior','Actual · hoy','Δ vs anterior','Δ total']
  const mr: {key:string;label:string}[] = [
    {key:'weight',label:'Peso (kg)'},{key:'height',label:'Talla (m)'},
    {key:'waist',label:'Cintura (cm)'},{key:'hip',label:'Cadera (cm)'},
    {key:'arm',label:'Brazo (cm)'},{key:'chest',label:'Pecho (cm)'},
    {key:'thigh',label:'Muslo (cm)'},{key:'bmi',label:'IMC'},
  ]

  sf(doc,G100); doc.rect(MG,y,COL,6,'F')
  cx=MG
  mh.forEach((h,i) => {
    const w = mc[i] as number
    sd(doc,G100); doc.rect(cx,y,w,6,'D')
    st(doc,I500); doc.setFontSize(6); doc.setFont('helvetica','bold')
    doc.text(h.toUpperCase(),cx+1.5,y+4)
    cx += w
  })
  y += 6

  mr.forEach(({key,label}) => {
    const m = data.measures[key as keyof typeof data.measures]
    const pv = m.previous ? parseFloat(m.previous) : null
    const cv = m.current  ? parseFloat(m.current)  : null
    const df = pv!==null&&cv!==null ? cv-pv : null
    const rH=7; cx=MG
    const vs: string[] = [
      label, m.goal||'—', m.previous||'—', m.current||'—',
      df!==null?(df<0?`▼ ${Math.abs(df).toFixed(1)}`:`▲ ${df.toFixed(1)}`):'—',
      df!==null?(df<0?`▼ ${Math.abs(df).toFixed(1)}`:`▲ ${df.toFixed(1)}`):'—',
    ]
    vs.forEach((val,i) => {
      const w = mc[i] as number
      const isTr = i>=4
      sf(doc,i===0?G25:WHT); sd(doc,G100); doc.rect(cx,y,w,rH,'FD')
      const col = isTr&&val.startsWith('▼')?'#2D7A3A':isTr&&val.startsWith('▲')?'#C0392B':i===0?I700:I900
      st(doc,col); doc.setFontSize(7.5); doc.setFont('helvetica',i===0?'bold':'normal')
      doc.text(val,cx+1.5,y+5)
      cx += w
    })
    y += rH
  })
  y += 3

  y = secHead(doc,y,'Motivación y asesoría personalizada')
  y += 1
  const lw2 = c2-1; const rx2 = MG+c2+1; const ly2 = y
  sf(doc,G700); doc.rect(MG,ly2,lw2,36,'F')
  st(doc,G500); doc.setFontSize(6); doc.setFont('helvetica','bold')
  doc.text('MOTIVACIÓN PRINCIPAL',MG+3,ly2+6)
  st(doc,WHT); doc.setFontSize(8); doc.setFont('helvetica','normal')
  const ml = doc.splitTextToSize(data.motivation||'—',lw2-6) as string[]
  doc.text(ml,MG+3,ly2+11)
  const ry2 = txtBlock(doc,rx2,ly2,c2-1,'Asesoría personalizada',data.personalizedAdvice??'')
  y = Math.max(ly2+38,ry2)+3

  y = secHead(doc,y,'Próxima cita')
  y += 1
  sf(doc,G950); doc.rect(MG,y,COL,18,'F')
  st(doc,G500); doc.setFontSize(6); doc.setFont('helvetica','bold')
  doc.text('FECHA PROGRAMADA',MG+3,y+5)
  st(doc,WHT); doc.setFontSize(11); doc.setFont('helvetica','bold')
  const ad = data.nextAppointment
    ? new Date(data.nextAppointment).toLocaleDateString('es',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
    : '—'
  doc.text(ad.charAt(0).toUpperCase()+ad.slice(1),MG+3,y+13)
  y += 21

  doc.addPage()
  pgHead(doc,caseNumber,nm,3,TOT)
  y = 17

  const my = data.nextAppointment
    ? new Date(data.nextAppointment).toLocaleDateString('es',{month:'long',year:'numeric'}).toUpperCase()
    : new Date().toLocaleDateString('es',{month:'long',year:'numeric'}).toUpperCase()
  y = secHead(doc,y,`Plan de alimentación semanal — ${my}`)
  y += 1

  if(data.foodIntolerances){
    const chips = data.foodIntolerances.split(',').map(s=>s.trim()).filter(Boolean)
    st(doc,I500); doc.setFontSize(6.5); doc.setFont('helvetica','bold')
    doc.text('Sin: ',MG,y+3.5)
    let chx = MG+8
    chips.forEach(chip => {
      sf(doc,G100); sd(doc,G200)
      const w = doc.getTextWidth(chip)+5
      doc.roundedRect(chx,y,w,5,1,1,'FD')
      st(doc,G700); doc.setFont('helvetica','normal')
      doc.text(chip,chx+2.5,y+3.5)
      chx += w+2
    })
    y += 7
  }

  const pc: number[] = [16,(COL-16)/4,(COL-16)/4,(COL-16)/4,(COL-16)/4]
  const mcl: string[] = ['Desayuno','Almuerzo','Cena','Meriendas']
  const dyl: string[] = ['LUNES','MARTES','MIÉRC.','JUEVES','VIERNES','SÁBADO','DOMINGO']

  sf(doc,G950); doc.rect(MG,y,COL,7,'F')
  cx=MG
  ;(['', ...mcl] as string[]).forEach((h,i) => {
    const w = pc[i] as number
    sd(doc,G700); doc.rect(cx,y,w,7,'D')
    st(doc,WHT); doc.setFontSize(6.5); doc.setFont('helvetica','bold')
    if(h) doc.text(h.toUpperCase(),cx+1.5,y+4.5)
    cx += w
  })
  y += 7

  data.mealPlan.forEach((row,idx) => {
    const rv: string[] = [row.breakfast,row.lunch,row.dinner,row.snacks]
    const maxL = Math.max(...rv.map(v => (doc.splitTextToSize(v||' ',(pc[1] as number)-3) as string[]).length))
    const rH = Math.max(10,maxL*3.5+4)
    cx=MG
    sf(doc,G25); sd(doc,G100); doc.rect(cx,y,pc[0] as number,rH,'FD')
    st(doc,G950); doc.setFontSize(6.5); doc.setFont('helvetica','bold')
    doc.text(dyl[idx] as string,cx+1.5,y+rH/2+1.5)
    cx += pc[0] as number
    rv.forEach((val,i) => {
      const w = pc[i+1] as number
      sf(doc,i%2===0?WHT:CRM); sd(doc,G100); doc.rect(cx,y,w,rH,'FD')
      st(doc,I700); doc.setFontSize(7); doc.setFont('helvetica','normal')
      const lines = doc.splitTextToSize(val||'—',w-3) as string[]
      doc.text(lines,cx+1.5,y+4)
      cx += w
    })
    y += rH
  })

  const fn2 = `feel-better-consulta-${caseNumber}-${nm.replace(/\s+/g,'-').toLowerCase()}.pdf`
  doc.save(fn2)
}
