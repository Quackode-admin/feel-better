const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000'

export async function getPatientsApi(token: string) {
  const res = await fetch(`${API_URL}/api/v1/patients`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Error cargando pacientes')
  return res.json()
}

export async function createPatientApi(token: string, data: any) {
  const res = await fetch(`${API_URL}/api/v1/patients`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error creando paciente')
  return res.json()
}

export async function getPatientByIdApi(token: string, id: string) {
  const res = await fetch(`${API_URL}/api/v1/patients/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Error cargando paciente')
  return res.json()
}
