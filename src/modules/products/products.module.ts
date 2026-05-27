import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductImagesService } from './products-images.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductImagesService],
})
export class ProductsModule {}