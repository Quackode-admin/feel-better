import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../shared/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByClerkId(clerkId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId },
      include: { profile: true },
    })
    if (!user) throw new NotFoundException('Usuario no encontrado')
    return user
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { profile: true },
    })
    if (!user) throw new NotFoundException('Usuario no encontrado')
    return user
  }

  async updateProfile(
    clerkId: string,
    data: {
      fullName?: string
      phone?: string
      birthDate?: Date
      gender?: string
    },
  ) {
    const user = await this.findByClerkId(clerkId)

    return this.prisma.profile.update({
      where: { userId: user.id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        birthDate: data.birthDate,
        gender: data.gender as any,
        updatedById: user.id,
      },
    })
  }

  async findAllNutritionists() {
    return this.prisma.user.findMany({
      where: { role: 'nutritionist', deletedAt: null, isActive: true },
      include: { profile: true, nutritionist: true },
    })
  }

  async findAllPatients() {
    return this.prisma.user.findMany({
      where: { role: 'patient', deletedAt: null, isActive: true },
      include: { profile: true, patient: true },
    })
  }

  async deactivateUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false, deletedAt: new Date() },
    })
  }

  async changeRole(id: string, role: 'admin' | 'nutritionist' | 'patient' | 'guardian') {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    })
  }
}
