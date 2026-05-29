import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { PrismaService } from '../shared/prisma.service'
import { Resend } from 'resend'
import * as crypto from 'crypto'

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name)
  private readonly resend: Resend

  constructor(private readonly prisma: PrismaService) {
    this.resend = new Resend(process.env['RESEND_API_KEY'])
  }

  async create(
    data: {
      email: string
      firstName: string
      lastName: string
      specialty: string
      phone?: string
      country?: string
      clinic?: string
    },
    createdById: string,
  ) {
    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000)

    const invitation = await this.prisma.invitation.create({
      data: {
        email: data.email,
        tokenHash,
        expiresAt,
        firstName: data.firstName,
        lastName: data.lastName,
        specialty: data.specialty,
        phone: data.phone ?? null,
        country: data.country ?? null,
        clinic: data.clinic ?? null,
        createdById,
        status: 'pending',
      },
    })

    await this.prisma.user.create({
      data: {
        clerkId: `pending_inv_${invitation.id}`,
        email: data.email,
        role: 'nutritionist',
        isActive: false,
        profile: {
          create: {
            fullName: `${data.firstName} ${data.lastName}`.trim(),
            phone: data.phone ?? null,
            country: data.country ?? null,
          },
        },
        nutritionist: {
          create: {
            status: 'pending_invitation',
            specialties: [data.specialty],
            phone: data.phone ?? null,
            country: data.country ?? null,
            clinic: data.clinic ?? null,
            createdById,
          },
        },
      },
    })

    await this.sendInvitationEmail({ to: data.email, firstName: data.firstName, token: rawToken })

    this.logger.log(`Invitación creada y enviada a ${data.email}`)
    return { message: 'Invitación enviada correctamente', email: data.email, expiresAt }
  }

  async validateToken(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const invitation = await this.prisma.invitation.findUnique({ where: { tokenHash } })
    if (!invitation) throw new NotFoundException('Token de invitación no válido')

    if (invitation.status !== 'pending') {
      throw new BadRequestException(
        invitation.status === 'accepted'
          ? 'Esta invitación ya fue utilizada'
          : 'Esta invitación ha sido revocada o expirada',
      )
    }

    if (new Date() > invitation.expiresAt) {
      await this.prisma.invitation.update({ where: { id: invitation.id }, data: { status: 'expired' } })
      throw new BadRequestException('El token de invitación ha expirado.')
    }

    return invitation
  }

  async markAsAccepted(tokenHash: string) {
    return this.prisma.invitation.update({
      where: { tokenHash },
      data: { status: 'accepted', acceptedAt: new Date() },
    })
  }

  private async sendInvitationEmail(params: { to: string; firstName: string; token: string }) {
    const onboardingUrl = `${process.env['FRONTEND_URL'] ?? 'https://app.feel-better.fit'}/onboarding/${params.token}`

    try {
      await this.resend.emails.send({
        from: 'Feel Better <no-reply@feel-better.fit>',
        to: params.to,
        subject: 'Bienvenido a Feel Better — Completa tu registro',
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <body style="font-family: Inter, Arial, sans-serif; background-color: #FAFAFA; margin: 0; padding: 40px 20px;">
            <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
              <div style="background-color: #154212; padding: 32px; text-align: center;">
                <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 0;">Feel Better</h1>
                <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 8px 0 0;">Tu nutricionista, en tu bolsillo</p>
              </div>
              <div style="padding: 40px 32px;">
                <h2 style="color: #154212; font-size: 22px; font-weight: 700; margin: 0 0 16px;">¡Hola, ${params.firstName}!</h2>
                <p style="color: #42493E; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Has sido invitado a unirte a <strong>Feel Better</strong> como nutricionista.</p>
                <p style="color: #42493E; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">Este enlace es válido por <strong>72 horas</strong>.</p>
                <div style="text-align: center; margin-bottom: 32px;">
                  <a href="${onboardingUrl}" style="display: inline-block; background-color: #154212; color: #FFFFFF; font-size: 16px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
                    Completar registro
                  </a>
                </div>
                <p style="color: #72796E; font-size: 14px;">Si no esperabas este correo, puedes ignorarlo.</p>
              </div>
              <div style="padding: 24px 32px; border-top: 1px solid #F3F4F6;">
                <p style="color: #72796E; font-size: 12px; margin: 0; text-align: center;">© ${new Date().getFullYear()} Feel Better. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      })
    } catch (error) {
      this.logger.error(`Error enviando email a ${params.to}`, error)
    }
  }
}
