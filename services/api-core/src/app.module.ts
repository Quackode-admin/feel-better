import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { WebhooksModule } from './webhooks/webhooks.module'
import { SharedModule } from './shared/shared.module'
import { RedisModule } from './redis/redis.module'
import { FilesModule } from './files/files.module'
import { UsersModule } from './users/users.module'
import { PatientsModule } from './patients/patients.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    SharedModule,
    RedisModule,
    WebhooksModule,
    FilesModule,
    UsersModule,
    PatientsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
