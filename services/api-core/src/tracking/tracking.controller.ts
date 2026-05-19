import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common'
import { TrackingService } from './tracking.service'
import { ClerkAuthGuard } from '../auth/clerk.guard'

@Controller('patients/:patientId/tracking')
@UseGuards(ClerkAuthGuard)
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('weight')
  getWeightHistory(@Param('patientId') patientId: string, @Req() req: any) {
    return this.trackingService.getWeightHistory(patientId, req.auth)
  }

  @Post('weight')
  addWeight(
    @Param('patientId') patientId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.trackingService.addWeightRecord(patientId, body, req.auth)
  }

  @Get('metrics')
  getMetrics(@Param('patientId') patientId: string, @Req() req: any) {
    return this.trackingService.getMetrics(patientId, req.auth)
  }
}
