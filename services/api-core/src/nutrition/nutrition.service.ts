import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../shared/prisma.service'

@Injectable()
export class NutritionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByPatient(patientId: string, requestingUser: any) {
    await this.verifyPatientAccess(patientId, requestingUser)

    return this.prisma.nutritionPlan.findMany({
      where: { patientId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string, requestingUser: any) {
    const plan = await this.prisma.nutritionPlan.findUnique({
      where: { id, deletedAt: null },
      include: {
        patient: { include: { user: { include: { profile: true } } } },
        nutritionist: { include: { user: { include: { profile: true } } } },
      },
    })

    if (!plan) throw new NotFoundException('Plan nutricional no encontrado')
    await this.verifyPatientAccess(plan.patientId, requestingUser)

    return plan
  }

  async create(patientId: string, data: any, requestingUser: any) {
    if (!['nutritionist', 'admin'].includes(requestingUser.role)) {
      throw new ForbiddenException('Solo nutricionistas pueden crear planes')
    }

    await this.verifyPatientAccess(patientId, requestingUser)

    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId: requestingUser.dbId },
    })

    return this.prisma.nutritionPlan.create({
      data: {
        patientId,
        nutritionistId: nutritionist!.id,
        title: data.title,
        description: data.description,
        caloriesTarget: data.caloriesTarget,
        proteinGrams: data.proteinGrams,
        carbsGrams: data.carbsGrams,
        fatGrams: data.fatGrams,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status ?? 'draft',
        createdById: requestingUser.dbId,
      },
    })
  }

  async update(id: string, data: any, requestingUser: any) {
    const plan = await this.prisma.nutritionPlan.findUnique({
      where: { id, deletedAt: null },
    })
    if (!plan) throw new NotFoundException('Plan no encontrado')

    if (!['nutritionist', 'admin'].includes(requestingUser.role)) {
      throw new ForbiddenException('Solo nutricionistas pueden editar planes')
    }

    return this.prisma.nutritionPlan.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.caloriesTarget && { caloriesTarget: data.caloriesTarget }),
        ...(data.proteinGrams && { proteinGrams: data.proteinGrams }),
        ...(data.carbsGrams && { carbsGrams: data.carbsGrams }),
        ...(data.fatGrams && { fatGrams: data.fatGrams }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.status && { status: data.status }),
        updatedById: requestingUser.dbId,
      },
    })
  }

  async softDelete(id: string, requestingUser: any) {
    if (!['nutritionist', 'admin'].includes(requestingUser.role)) {
      throw new ForbiddenException('Sin permisos para eliminar planes')
    }

    return this.prisma.nutritionPlan.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: requestingUser.dbId },
    })
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
        throw new ForbiddenException('No tienes acceso a este paciente')
      }
      return
    }

    if (requestingUser.role === 'patient') {
      if (patient.userId !== requestingUser.dbId) {
        throw new ForbiddenException('No tienes acceso a este plan')
      }
      return
    }

    throw new ForbiddenException('Acceso denegado')
  }
}
