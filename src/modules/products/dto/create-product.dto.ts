import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

class VariantInput {
  @IsString()
  sku: string;

  @IsString()
  color: string;

  @IsString()
  size: string;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  basePrice: number;

  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantInput)
  variants: VariantInput[];
}