import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsInt()
  adminId?: number;
}