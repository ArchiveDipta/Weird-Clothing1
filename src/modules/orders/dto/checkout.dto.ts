import { IsInt, IsPositive, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemInput {
  @IsInt()
  variantId: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsInt()
  warehouseId: number;
}

export class CheckoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemInput)
  items: CartItemInput[];

  @IsOptional()
  @IsString()
  voucherCode?: string;

  @IsString()
  shippingAddress: string;
}