import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { OnboardingService } from './onboarding.service'
import { CompleteOnboardingDto } from './complete-onboarding.dto'

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly service: OnboardingService) {}

  @Get(':token')
  validateToken(@Param('token') token: string) {
    return this.service.validateToken(token)
  }

  @Post(':token/complete')
  @HttpCode(HttpStatus.CREATED)
  complete(@Param('token') token: string, @Body() dto: CompleteOnboardingDto) {
    return this.service.complete(token, dto)
  }
}
