import {
  Controller,
  Post,
  Headers,
  Body,
  Req,
  HttpCode,
  BadRequestException,
} from '@nestjs/common'
import { Webhook } from 'svix'
import { PrismaService } from '../shared/prisma.service'

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('clerk')
  @HttpCode(200)
  async handleClerkWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Body() body: any,
  ) {
    const webhookSecret = process.env['CLERK_WEBHOOK_SECRET']
    if (!webhookSecret) throw new BadRequestException('Webhook secret no configurado')

    const wh = new Webhook(webhookSecret)

    let event: any
    try {
      event = wh.verify(JSON.stringify(body), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      })
    } catch {
      throw new BadRequestException('Webhook signature inválida')
    }

    const { type, data } = event

    if (type === 'user.created') {
      const email = data.email_addresses?.[0]?.email_address
      const firstName = data.first_name ?? ''
      const lastName = data.last_name ?? ''

      await this.prisma.user.upsert({
        where: { email },
        create: {
          id: data.id,
          email,
          passwordHash: '',
          role: 'patient',
          isActive: true,
          profile: {
            create: {
              fullName: `${firstName} ${lastName}`.trim() || email,
            },
          },
        },
        update: {
          profile: {
            update: {
              fullName: `${firstName} ${lastName}`.trim() || email,
            },
          },
        },
      })

      console.warn('Usuario creado en DB:', email)
    }

    if (type === 'user.deleted') {
      await this.prisma.user.updateMany({
        where: { id: data.id },
        data: { deletedAt: new Date(), isActive: false },
      })
      console.warn('Usuario desactivado en DB:', data.id)
    }

    return { ok: true }
  }
}
