import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { ClerkWebhookController } from './webhooks/clerk-webhook.controller'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [ClerkWebhookController],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
