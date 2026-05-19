import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../shared/prisma.service'

@Injectable()
export class TrackingService {
  constructor(private readonly prisma: PrismaService) {}

  async getWeightHistory(patientId: string, requestingUser: any) {
    await this.verifyPatientAccess(patientId, requestingUser)

    return this.prisma.weightRecord.findMany({
      where: { patientId, deletedAt: null },
      orderBy: { recordedAt: 'desc' },
    })
  }

  async addWeightRecord(patientId: string, data: any, requestingUser: any) {
    await this.verifyPatientAccess(patientId, requestingUser)

    // Calcular IMC automáticamente si hay altura
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    })

    let bmi = null
    if (patient?.heightCm && data.weightKg) {
      const heightM = Number(patient.heightCm) / 100
      bmi = Number(data.weightKg) / (heightM * heightM)
    }

    return this.prisma.weightRecord.create({
      data: {
        patientId,
        weightKg: data.weightKg,
        bmi: bmi ? parseFloat(bmi.toFixed(2)) : null,
        bodyFatPct: data.bodyFatPct ?? null,
        recordedAt: data.recordedAt ? new Date(data.recordedAt) : new Date(),
        notes: data.notes ?? null,
        createdById: requestingUser.dbId,
      },
    })
  }

  async getMetrics(patientId: string, requestingUser: any) {
    await this.verifyPatientAccess(patientId, requestingUser)

    const records = await this.prisma.weightRecord.findMany({
      where: { patientId, deletedAt: null },
      orderBy: { recordedAt: 'desc' },
      take: 30,
    })

    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    })

    const latest = records[0]
    const initial = records[records.length - 1]

    return {
      currentWeight: latest?.weightKg ?? null,
      currentBmi: latest?.bmi ?? null,
      targetWeight: patient?.targetWeightKg ?? null,
      initialWeight: patient?.initialWeightKg ?? null,
      weightLost: initial && latest
        ? Number(initial.weightKg) - Number(latest.weightKg)
        : null,
      totalRecords: records.length,
      history: records,
    }
  }

  private async verifyPatientAccess(patientId: string, requestingUser: any) {
    if (requestingUser.role === 'admin') return

    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId, deletedAt: null },
    })
    if (!patient) throw new NotFoundException('Paciente no encontrado')

    if (requestingUser.role === 'nutritionist') {
      const nutritionist = await this.prisma.nutritionist.findUnique({
        where: { userId: requestingUser.dbId },
      })
      if (!nutritionist || patient.nutritionistId !== nutritionist.id) {
        throw new ForbiddenException('Sin acceso a este paciente')
      }
      return
    }

    if (requestingUser.role === 'patient') {
      if (patient.userId !== requestingUser.dbId) {
        throw new ForbiddenException('Sin acceso')
      }
      return
    }

    throw new ForbiddenException('Acceso denegado')
  }
}
