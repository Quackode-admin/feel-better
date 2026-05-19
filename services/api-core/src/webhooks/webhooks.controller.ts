import {
  Controller,
  Post,
  Headers,
  Body,
  RawBodyRequest,
  Req,
  HttpCode,
  BadRequestException,
} from '@nestjs/common'
import { Webhook } from 'svix'

@Controller('webhooks')
export class WebhooksController {
  @Post('clerk')
  @HttpCode(200)
  async handleClerkWebhook(
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
    @Req() req: RawBodyRequest<Request>,
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
      console.warn('Nuevo usuario registrado:', data.id, data.email_addresses?.[0]?.email_address)
      // TODO: crear usuario en PostgreSQL
    }

    if (type === 'user.updated') {
      console.warn('Usuario actualizado:', data.id)
    }

    if (type === 'user.deleted') {
      console.warn('Usuario eliminado:', data.id)
    }

    return { ok: true }
  }
}
