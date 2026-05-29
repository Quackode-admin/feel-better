import { Module } from '@nestjs/common'
import { OnboardingController } from './onboarding.controller'
import { OnboardingService } from './onboarding.service'
import { InvitationsModule } from '../invitations/invitations.module'
import { SharedModule } from '../shared/shared.module'

@Module({
  imports: [SharedModule, InvitationsModule],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
