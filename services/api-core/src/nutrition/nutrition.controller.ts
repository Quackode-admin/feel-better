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
import { NutritionService } from './nutrition.service'
import { ClerkAuthGuard } from '../auth/clerk.guard'

@Controller('patients/:patientId/nutrition-plans')
@UseGuards(ClerkAuthGuard)
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Get()
  findAll(@Param('patientId') patientId: string, @Req() req: any) {
    return this.nutritionService.findAllByPatient(patientId, req.auth)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.nutritionService.findById(id, req.auth)
  }

  @Post()
  create(
    @Param('patientId') patientId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.nutritionService.create(patientId, body, req.auth)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.nutritionService.update(id, body, req.auth)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.nutritionService.softDelete(id, req.auth)
  }
}
