import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  IsArray,
  IsInt,
  Min,
  Max,
} from 'class-validator'
import { NutritionistStatus } from '@prisma/client'

export class UpdateNutritionistDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[]

  @IsOptional()
  @IsString()
  @MaxLength(100)
  clinic?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60)
  yearsExp?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[]

  @IsOptional()
  @IsEnum(NutritionistStatus)
  status?: NutritionistStatus
}
