import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../shared/prisma.service'

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(requestingUser: any) {
    
    const where: any = { deletedAt: null }

    if (requestingUser.role === 'nutritionist') {
      const nutritionist = await this.prisma.nutritionist.findUnique({
        where: { userId: requestingUser.dbId },
      })
      if (!nutritionist) return []
      where.nutritionistId = nutritionist.id
    }

    return this.prisma.patient.findMany({
      where,
      include: {
        user: { include: { profile: true } },
        nutritionist: { include: { user: { include: { profile: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string, requestingUser: any) {
    const patient = await this.prisma.patient.findUnique({
      where: { id, deletedAt: null },
      include: {
        user: { include: { profile: true } },
        nutritionist: { include: { user: { include: { profile: true } } } },
        weightRecords: { orderBy: { recordedAt: 'desc' }, take: 10 },
        nutritionPlans: { where: { deletedAt: null } },
        appointments: {
          where: { deletedAt: null },
          orderBy: { scheduledAt: 'desc' },
          take: 5,
        },
      },
    })

    if (!patient) throw new NotFoundException('Paciente no encontrado')
    await this.verifyAccess(patient, requestingUser)

    if (requestingUser.role === 'patient') {
      const { medicalNotes, ...rest } = patient as any
      return rest
    }

    return patient
  }

  async create(data: any, requestingUser: any) {
    
    if (!['nutritionist', 'admin'].includes(requestingUser.role)) {
      throw new ForbiddenException('No tienes permisos para crear pacientes')
    }

    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId: requestingUser.dbId },
    })

    return this.prisma.patient.create({
      data: {
        user: {
          create: {
            clerkId: `pending_${Date.now()}`,
            email: data.email,
            role: 'patient',
            isActive: true,
            profile: {
              create: {
                fullName: data.fullName,
                ...(data.birthDate && { birthDate: new Date(data.birthDate) }),
                ...(data.gender && { gender: data.gender }),
                ...(data.phone && { phone: data.phone }),
              },
            },
          },
        },
        ...(nutritionist && {
          nutritionist: { connect: { id: nutritionist.id } },
        }),
        ...(data.heightCm && { heightCm: data.heightCm }),
        ...(data.initialWeightKg && { initialWeightKg: data.initialWeightKg }),
        ...(data.targetWeightKg && { targetWeightKg: data.targetWeightKg }),
        ...(data.allergies && { allergies: data.allergies }),
        dietaryRestrictions: data.dietaryRestrictions ?? [],
        ...(data.medicalConditions && { medicalConditions: data.medicalConditions }),
        ...(data.currentMedications && { currentMedications: data.currentMedications }),
        ...(data.medicalNotes && { medicalNotes: data.medicalNotes }),
        createdById: requestingUser.dbId,
      },
      include: {
        user: { include: { profile: true } },
      },
    })
  }

  async update(id: string, data: any, requestingUser: any) {
    const patient = await this.prisma.patient.findUnique({
      where: { id, deletedAt: null },
    })
    if (!patient) throw new NotFoundException('Paciente no encontrado')
    await this.verifyAccess(patient, requestingUser)

    return this.prisma.patient.update({
      where: { id },
      data: {
        ...(data.heightCm && { heightCm: data.heightCm }),
        ...(data.targetWeightKg && { targetWeightKg: data.targetWeightKg }),
        ...(data.allergies && { allergies: data.allergies }),
        ...(data.dietaryRestrictions && { dietaryRestrictions: data.dietaryRestrictions }),
        ...(data.medicalConditions && { medicalConditions: data.medicalConditions }),
        ...(data.currentMedications && { currentMedications: data.currentMedications }),
        ...(data.medicalNotes && { medicalNotes: data.medicalNotes }),
        updatedById: requestingUser.dbId,
      },
      include: { user: { include: { profile: true } } },
    })
  }

  async softDelete(id: string, requestingUser: any) {
    if (requestingUser.role !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden eliminar pacientes')
    }
    return this.prisma.patient.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: requestingUser.dbId },
    })
  }

  private async verifyAccess(patient: any, requestingUser: any) {
    if (requestingUser.role === 'admin') return

    if (requestingUser.role === 'nutritionist') {
      const nutritionist = await this.prisma.nutritionist.findUnique({
        where: { userId: requestingUser.dbId },
      })
      if (!nutritionist || patient.nutritionistId !== nutritionist.id) {
        throw new ForbiddenException('No tienes acceso a este paciente')
      }
      return
    }

    if (requestingUser.role === 'patient') {
      if (patient.userId !== requestingUser.dbId) {
        throw new ForbiddenException('No tienes acceso a este paciente')
      }
      return
    }

    throw new ForbiddenException('Acceso denegado')
  }
}
