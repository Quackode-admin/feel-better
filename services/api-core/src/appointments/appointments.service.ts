import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../shared/prisma.service'

@Injectable()
export class AppointmentsService {
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

    if (requestingUser.role === 'patient') {
      const patient = await this.prisma.patient.findUnique({
        where: { userId: requestingUser.dbId },
      })
      if (!patient) return []
      where.patientId = patient.id
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: { include: { user: { include: { profile: true } } } },
        nutritionist: { include: { user: { include: { profile: true } } } },
      },
      orderBy: { scheduledAt: 'desc' },
    })
  }

  async create(data: any, requestingUser: any) {
    if (!['nutritionist', 'admin'].includes(requestingUser.role)) {
      throw new ForbiddenException('Solo nutricionistas pueden crear citas')
    }

    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId: requestingUser.dbId },
    })

    return this.prisma.appointment.create({
      data: {
        patientId: data.patientId,
        nutritionistId: nutritionist!.id,
        scheduledAt: new Date(data.scheduledAt),
        durationMin: data.durationMin ?? 60,
        status: 'scheduled',
        createdById: requestingUser.dbId,
      },
      include: {
        patient: { include: { user: { include: { profile: true } } } },
        nutritionist: { include: { user: { include: { profile: true } } } },
      },
    })
  }

  async update(id: string, data: any, requestingUser: any) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id, deletedAt: null },
    })
    if (!appointment) throw new NotFoundException('Cita no encontrada')

    return this.prisma.appointment.update({
      where: { id },
      data: {
        ...(data.scheduledAt && { scheduledAt: new Date(data.scheduledAt) }),
        ...(data.durationMin && { durationMin: data.durationMin }),
        ...(data.status && { status: data.status }),
        ...(data.sessionNotes && { sessionNotes: data.sessionNotes }),
        ...(data.cancelledReason && { cancelledReason: data.cancelledReason }),
        updatedById: requestingUser.dbId,
      },
    })
  }

  async softDelete(id: string, requestingUser: any) {
    if (!['nutritionist', 'admin'].includes(requestingUser.role)) {
      throw new ForbiddenException('Sin permisos para cancelar citas')
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: 'cancelled',
        deletedAt: new Date(),
        updatedById: requestingUser.dbId,
      },
    })
  }
}
