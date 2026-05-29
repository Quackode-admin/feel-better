import { IsNotEmpty, IsUUID } from 'class-validator'

export class ReassignPatientDto {
  @IsUUID()
  @IsNotEmpty()
  nutritionistId!: string
}
