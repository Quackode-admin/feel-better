import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Role, User } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByClerkId(clerkId: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { clerkId } })
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async createFromClerk(data: {
    clerkId: string
    email: string
    role?: Role
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        clerkId: data.clerkId,
        email: data.email,
        role: data.role ?? Role.patient,
      },
    })
  }

  async updateRole(clerkId: string, role: Role): Promise<User> {
    return this.prisma.user.update({
      where: { clerkId },
      data: { role },
    })
  }

  async deactivate(clerkId: string): Promise<void> {
    await this.prisma.user.update({
      where: { clerkId },
      data: { isActive: false },
    })
  }
}
