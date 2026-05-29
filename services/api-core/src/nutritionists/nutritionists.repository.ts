import { Injectable } from '@nestjs/common'
import { PrismaService } from '../shared/prisma.service'
import { NutritionistStatus, Prisma } from '@prisma/client'

@Injectable()
export class NutritionistsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    page: number
    limit: number
    search?: string
    status?: NutritionistStatus
    specialty?: string
    country?: string
  }) {
    const { page, limit, search, status, specialty, country } = params
    const skip = (page - 1) * limit

    const where: Prisma.NutritionistWhereInput = {
      deletedAt: null,
      ...(status && { status }),
      ...(specialty && { specialties: { has: specialty } }),
      ...(country && { country }),
      ...(search && {
        OR: [
          { user: { email: { contains: search, mode: Prisma.QueryMode.insensitive } } },
          { user: { profile: { fullName: { contains: search, mode: Prisma.QueryMode.insensitive } } } },
        ],
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.nutritionist.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              isActive: true,
              createdAt: true,
              profile: {
                select: { fullName: true, phone: true, avatarUrl: true, country: true },
              },
            },
          },
          _count: { select: { patients: { where: { deletedAt: null } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.nutritionist.count({ where }),
    ])

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async findById(id: string) {
    return this.prisma.nutritionist.findUnique({
      where: { id, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            profile: true,
          },
        },
        _count: {
          select: {
            patients: { where: { deletedAt: null } },
            appointments: { where: { deletedAt: null } },
          },
        },
      },
    })
  }

  async update(id: string, data: Prisma.NutritionistUpdateInput, updatedById: string) {
    return this.prisma.nutritionist.update({
      where: { id },
      data: { ...data, updatedById },
      include: { user: { select: { id: true, email: true, profile: true } } },
    })
  }

  async softDelete(id: string, deletedById: string) {
    return this.prisma.$transaction(async (tx) => {
      const patients = await tx.patient.findMany({
        where: { nutritionistId: id, deletedAt: null },
        select: { id: true },
      })

      if (patients.length > 0) {
        await tx.patient.updateMany({
          where: { nutritionistId: id, deletedAt: null },
          data: { nutritionistId: null, status: 'unassigned', updatedById: deletedById },
        })
      }

      const nutritionist = await tx.nutritionist.update({
        where: { id },
        data: { status: 'deleted', deletedAt: new Date(), updatedById: deletedById },
      })

      await tx.user.update({
        where: { id: nutritionist.userId },
        data: { isActive: false, updatedById: deletedById },
      })

      return { nutritionist, unassignedPatients: patients.length }
    })
  }

  async countUnassignedPatients(id: string) {
    return this.prisma.patient.count({ where: { nutritionistId: id, deletedAt: null } })
  }
}
