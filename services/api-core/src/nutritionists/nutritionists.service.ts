import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../shared/prisma.service'
import { NutritionistsRepository } from './nutritionists.repository'
import { InvitationsService } from '../invitations/invitations.service'
import { CreateInvitationDto } from './dto/create-invitation.dto'
import { UpdateNutritionistDto } from './dto/update-nutritionist.dto'
import { ListNutritionistsDto } from './dto/list-nutritionists.dto'
import { ReassignPatientDto } from './dto/reassign-patient.dto'

@Injectable()
export class NutritionistsService {
  private readonly logger = new Logger(NutritionistsService.name)

  constructor(
    private readonly repository: NutritionistsRepository,
    private readonly prisma: PrismaService,
    private readonly invitationsService: InvitationsService,
  ) {}

  async findAll(params: ListNutritionistsDto) {
    const args: {
      page: number
      limit: number
      search?: string
      status?: any
      specialty?: string
      country?: string
    } = {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    }
    if (params.search) args.search = params.search
    if (params.status) args.status = params.status
    if (params.specialty) args.specialty = params.specialty
    if (params.country) args.country = params.country
    return this.repository.findAll(args)
  }

  async findById(id: string) {
    const nutritionist = await this.repository.findById(id)
    if (!nutritionist) throw new NotFoundException('Nutricionista no encontrado')
    return nutritionist
  }

  async invite(dto: CreateInvitationDto, adminId: string) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existingUser) throw new ConflictException('Ya existe un usuario registrado con ese correo')

    const existingInvitation = await this.prisma.invitation.findFirst({
      where: { email: dto.email, status: 'pending', deletedAt: null },
    })
    if (existingInvitation) {
      throw new ConflictException('Ya existe una invitación pendiente para ese correo.')
    }

    return this.invitationsService.create(dto, adminId)
  }

  async resendInvitation(nutritionistId: string, adminId: string) {
    const nutritionist = await this.findById(nutritionistId)
    if (nutritionist.status !== 'pending_invitation') {
      throw new BadRequestException('Solo se puede reenviar la invitación a nutricionistas en estado pendiente')
    }

    await this.prisma.invitation.updateMany({
      where: { email: nutritionist.user.email, status: 'pending' },
      data: { status: 'revoked' },
    })

    const inviteData: {
      email: string
      firstName: string
      lastName: string
      specialty: string
      phone?: string
      country?: string
      clinic?: string
    } = {
      email: nutritionist.user.email,
      firstName: nutritionist.user.profile?.fullName?.split(' ')[0] ?? '',
      lastName: nutritionist.user.profile?.fullName?.split(' ').slice(1).join(' ') ?? '',
      specialty: nutritionist.specialties[0] ?? '',
    }
    if (nutritionist.phone) inviteData.phone = nutritionist.phone
    if (nutritionist.country) inviteData.country = nutritionist.country
    if (nutritionist.clinic) inviteData.clinic = nutritionist.clinic

    return this.invitationsService.create(inviteData, adminId)
  }

  async update(id: string, dto: UpdateNutritionistDto, adminId: string) {
    await this.findById(id)

    const updateData: any = {}
    if (dto.phone !== undefined) updateData.phone = dto.phone
    if (dto.clinic !== undefined) updateData.clinic = dto.clinic
    if (dto.country !== undefined) updateData.country = dto.country
    if (dto.bio !== undefined) updateData.bio = dto.bio
    if (dto.yearsExp !== undefined) updateData.yearsExp = dto.yearsExp
    if (dto.certifications !== undefined) updateData.certifications = dto.certifications
    if (dto.status !== undefined) updateData.status = dto.status
    if (dto.specialties !== undefined) updateData.specialties = dto.specialties

    if (dto.status === 'disabled') {
      const nutritionist = await this.repository.findById(id)
      await this.prisma.user.update({ where: { id: nutritionist!.userId }, data: { isActive: false } })
    }

    if (dto.status === 'active') {
      const nutritionist = await this.repository.findById(id)
      await this.prisma.user.update({ where: { id: nutritionist!.userId }, data: { isActive: true } })
    }

    return this.repository.update(id, updateData, adminId)
  }

  async disable(id: string, adminId: string) {
    const nutritionist = await this.findById(id)
    if (nutritionist.status === 'deleted') throw new BadRequestException('El nutricionista ya está eliminado')

    await this.prisma.user.update({ where: { id: nutritionist.userId }, data: { isActive: false, updatedById: adminId } })
    return this.repository.update(id, { status: 'disabled' }, adminId)
  }

  async softDelete(id: string, adminId: string) {
    const nutritionist = await this.findById(id)
    if (nutritionist.status === 'deleted') throw new BadRequestException('El nutricionista ya está eliminado')

    const unassignedCount = await this.repository.countUnassignedPatients(id)
    this.logger.log(`Eliminando nutricionista ${id}. Pacientes a desasignar: ${unassignedCount}`)

    const result = await this.repository.softDelete(id, adminId)
    this.logger.log(`Nutricionista ${id} eliminado. ${result.unassignedPatients} pacientes desasignados.`)

    return { message: 'Nutricionista eliminado correctamente', unassignedPatients: result.unassignedPatients }
  }

  async getUnassignedPatients(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params
    const skip = (page - 1) * limit

    const where: any = {
      nutritionistId: null,
      deletedAt: null,
      status: 'unassigned',
    }

    if (search) {
      where.user = {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { profile: { fullName: { contains: search, mode: 'insensitive' } } },
        ],
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true, profile: { select: { fullName: true, phone: true, avatarUrl: true } } } },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.patient.count({ where }),
    ])

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async reassignPatient(patientId: string, dto: ReassignPatientDto, adminId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id: patientId, deletedAt: null } })
    if (!patient) throw new NotFoundException('Paciente no encontrado')

    const nutritionist = await this.repository.findById(dto.nutritionistId)
    if (!nutritionist) throw new NotFoundException('Nutricionista no encontrado')

    if (nutritionist.status !== 'active') {
      throw new BadRequestException('Solo se puede asignar pacientes a nutricionistas activos')
    }

    return this.prisma.patient.update({
      where: { id: patientId },
      data: { nutritionistId: dto.nutritionistId, status: 'in_treatment', updatedById: adminId },
      include: {
        user: { select: { email: true, profile: true } },
        nutritionist: { include: { user: { select: { email: true, profile: true } } } },
      },
    })
  }
}
