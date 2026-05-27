import { IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { VoucherType } from '@prisma/client';

export class CreateVoucherDto {
  @IsString()
  code: string;

  @IsEnum(VoucherType)
  type: VoucherType;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsNumber()
  minPurchase?: number;

  @IsOptional()
  @IsNumber()
  maxDiscount?: number;

  @IsDateString()
  validFrom: string;

  @IsDateString()
  validUntil: string;

  @IsOptional()
  @IsNumber()
  usageLimit?: number;
}