import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { NutritionistStatus } from '@prisma/client'

export class ListNutritionistsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20

  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsEnum(NutritionistStatus)
  status?: NutritionistStatus

  @IsOptional()
  @IsString()
  specialty?: string

  @IsOptional()
  @IsString()
  country?: string
}
