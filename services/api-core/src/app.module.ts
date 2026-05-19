import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { WebhooksModule } from './webhooks/webhooks.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    SharedModule,
    WebhooksModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
