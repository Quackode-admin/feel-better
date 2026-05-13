import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { PatientsModule } from './patients/patients.module'
import { NutritionModule } from './nutrition/nutrition.module'
import { AppointmentsModule } from './appointments/appointments.module'
import { TrackingModule } from './tracking/tracking.module'
import { ChatModule } from './chat/chat.module'
import { FilesModule } from './files/files.module'

@Module({
  imports: [
    // Carga variables de entorno globalmente
    ConfigModule.forRoot({ isGlobal: true, cache: true }),

    // Infraestructura
    DatabaseModule,

    // Dominio
    AuthModule,
    UsersModule,
    PatientsModule,
    NutritionModule,
    AppointmentsModule,
    TrackingModule,
    ChatModule,
    FilesModule,
  ],
})
export class AppModule {}
