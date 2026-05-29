import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../shared/prisma.service'
import { InvitationsService } from '../invitations/invitations.service'
import { CompleteOnboardingDto } from './complete-onboarding.dto'
import * as crypto from 'crypto'
import { createClerkClient } from '@clerk/backend'

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly invitationsService: InvitationsService,
  ) {}

  async validateToken(token: string) {
    const invitation = await this.invitationsService.validateToken(token)
    return {
      email: invitation.email,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      specialty: invitation.specialty,
      phone: invitation.phone,
      country: invitation.country,
      clinic: invitation.clinic,
    }
  }

  async complete(token: string, dto: CompleteOnboardingDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden')
    }

    if (!dto.acceptTerms) {
      throw new BadRequestException('Debes aceptar los términos y condiciones')
    }

    const invitation = await this.invitationsService.validateToken(token)
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const secretKey = process.env['CLERK_SECRET_KEY']
    if (!secretKey) throw new BadRequestException('Configuración de autenticación no disponible')

    const clerkClient = createClerkClient({ secretKey })

    let clerkUser: any
    try {
      clerkUser = await clerkClient.users.createUser({
        emailAddress: [invitation.email],
        password: dto.password,
        firstName: dto.firstName,
        lastName: dto.lastName,
      })
    } catch (error: any) {
      this.logger.error('Error creando usuario en Clerk', error)
      throw new BadRequestException(error?.errors?.[0]?.message ?? 'Error al crear el usuario.')
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { email: invitation.email },
        data: {
          clerkId: clerkUser.id,
          isActive: true,
          profile: {
            update: {
              fullName: `${dto.firstName} ${dto.lastName}`.trim(),
              ...(dto.birthDate && { birthDate: new Date(dto.birthDate) }),
              ...(dto.gender && { gender: dto.gender }),
              ...(dto.phone && { phone: dto.phone }),
              ...(dto.address && { address: dto.address }),
              ...(dto.idDocument && { idDocument: dto.idDocument }),
              ...(dto.country && { country: dto.country }),
            },
          },
        },
      })

      const user = await tx.user.findUnique({
        where: { email: invitation.email },
        include: { nutritionist: true },
      })

      if (user?.nutritionist) {
        await tx.nutritionist.update({
          where: { userId: user.id },
          data: {
            status: 'active',
            licenseNumber: dto.licenseNumber,
            specialties: dto.specialties,
            ...(dto.yearsExp !== undefined && { yearsExp: dto.yearsExp }),
            ...(dto.clinic && { clinic: dto.clinic }),
            ...(dto.country && { country: dto.country }),
            ...(dto.bio && { bio: dto.bio }),
            certifications: dto.certifications ?? [],
            ...(dto.phone && { phone: dto.phone }),
          },
        })
      }

      await this.invitationsService.markAsAccepted(tokenHash)
    })

    this.logger.log(`Onboarding completado para ${invitation.email}`)
    return { message: '¡Registro completado exitosamente! Ya puedes iniciar sesión.', email: invitation.email }
  }
}
