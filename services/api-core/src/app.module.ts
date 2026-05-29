import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { WebhooksModule } from './webhooks/webhooks.module'
import { SharedModule } from './shared/shared.module'
import { RedisModule } from './redis/redis.module'
import { FilesModule } from './files/files.module'
import { UsersModule } from './users/users.module'
import { PatientsModule } from './patients/patients.module'
import { NutritionModule } from './nutrition/nutrition.module'
import { AppointmentsModule } from './appointments/appointments.module'
import { TrackingModule } from './tracking/tracking.module'
import { AuthModule } from './auth/auth.module'
import { NutritionistsModule } from './nutritionists/nutritionists.module'
import { InvitationsModule } from './invitations/invitations.module'
import { OnboardingModule } from './onboarding/onboarding.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    SharedModule,
    RedisModule,
    AuthModule,
    WebhooksModule,
    FilesModule,
    UsersModule,
    PatientsModule,
    NutritionModule,
    AppointmentsModule,
    TrackingModule,
    NutritionistsModule,
    InvitationsModule,
    OnboardingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
