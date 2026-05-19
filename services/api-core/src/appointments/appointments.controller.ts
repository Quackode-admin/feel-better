import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { ClerkAuthGuard } from '../auth/clerk.guard'

@Controller('appointments')
@UseGuards(ClerkAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.appointmentsService.findAll(req.auth)
  }

  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.appointmentsService.create(body, req.auth)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.appointmentsService.update(id, body, req.auth)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.appointmentsService.softDelete(id, req.auth)
  }
}
