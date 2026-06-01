import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested, IsPositive, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

class VariantInput {
  @IsString()
  sku: string;

  @IsString()
  color: string;

  @IsString()
  size: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
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

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantInput)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return value;
  })
  variants: VariantInput[];
}