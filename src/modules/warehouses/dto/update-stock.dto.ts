import { IsInt, IsPositive } from 'class-validator';

export class UpdateStockDto {
  @IsInt()
  warehouseId: number;

  @IsInt()
  variantId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}