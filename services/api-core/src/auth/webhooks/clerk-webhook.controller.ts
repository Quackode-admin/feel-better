import {
  Controller,
  Post,
  Headers,
  RawBodyRequest,
  Req,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger'
import { Webhook } from 'svix'
import { Request } from 'express'
import { UsersService } from '../../users/users.service'

interface ClerkEmailAddress {
  email_address: string
  verification: { status: string } | null
}

interface ClerkUserCreatedEvent {
  type: 'user.created'
  data: {
    id: string
    email_addresses: ClerkEmailAddress[]
    primary_email_address_id: string
  }
}

interface ClerkUserDeletedEvent {
  type: 'user.deleted'
  data: { id: string }
}

type ClerkWebhookEvent = ClerkUserCreatedEvent | ClerkUserDeletedEvent

@ApiTags('webhooks')
@Controller('webhooks/clerk')
export class ClerkWebhookController {
  private readonly logger = new Logger(ClerkWebhookController.name)

  constructor(
    private readonly users: UsersService,
    private readonly config: ConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  async handle(
    @Req() req: RawBodyRequest<Request>,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    const secret = this.config.getOrThrow<string>('CLERK_WEBHOOK_SECRET')
    const wh = new Webhook(secret)

    let event: ClerkWebhookEvent
    try {
      event = wh.verify(req.rawBody!.toString(), {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as ClerkWebhookEvent
    } catch {
      throw new BadRequestException('Invalid webhook signature')
    }

    await this.processEvent(event)
    return { received: true }
  }

  private async processEvent(event: ClerkWebhookEvent) {
    switch (event.type) {
      case 'user.created': {
        const primary =
          event.data.email_addresses.find(
            (e) => e.verification?.status === 'verified',
          ) ?? event.data.email_addresses[0]

        if (!primary) {
          this.logger.warn(`User ${event.data.id} has no email address`)
          break
        }

        await this.users.createFromClerk({
          clerkId: event.data.id,
          email: primary.email_address,
        })
        this.logger.log(`User created: ${event.data.id}`)
        break
      }

      case 'user.deleted': {
        await this.users.deactivate(event.data.id)
        this.logger.log(`User deactivated: ${event.data.id}`)
        break
      }
    }
  }
}
