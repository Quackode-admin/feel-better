import { Module } from '@nestjs/common'
import { NutritionistsController } from './nutritionists.controller'
import { NutritionistsService } from './nutritionists.service'
import { NutritionistsRepository } from './nutritionists.repository'
import { InvitationsModule } from '../invitations/invitations.module'
import { SharedModule } from '../shared/shared.module'

@Module({
  imports: [SharedModule, InvitationsModule],
  controllers: [NutritionistsController],
  providers: [NutritionistsService, NutritionistsRepository],
  exports: [NutritionistsService],
})
export class NutritionistsModule {}
