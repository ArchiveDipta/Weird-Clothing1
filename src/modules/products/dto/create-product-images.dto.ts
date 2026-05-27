import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductImagesDto {
  @IsInt()
  productId: number;

  @IsOptional()
  @IsString()
  altText?: string;
}