import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import { join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, imageUrl?: string | null) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        basePrice: dto.basePrice,
        categoryId: dto.categoryId,
        isActive: dto.isActive ?? true,
        imageUrl: imageUrl,
        variants: {
          createMany: {
            data: dto.variants,
          },
        },
      },
      include: { variants: true, category: true },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: { variants: true, category: true },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { 
        variants: { 
          include: { stocks: { include: { warehouse: true } } } 
        }, 
        category: true 
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, dto: UpdateProductDto, imageUrl?: string) {
    const product = await this.findOne(id);
    
    const data: any = {
      name: dto.name,
      description: dto.description,
      basePrice: dto.basePrice,
      isActive: dto.isActive,
    };

    // Hapus gambar lama jika ada gambar baru
    if (imageUrl !== undefined && imageUrl !== null) {
      if (product.imageUrl) {
        await this.deleteImageFile(product.imageUrl);
      }
      data.imageUrl = imageUrl;
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: { variants: true, category: true },
    });
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    
    // Hapus gambar saat produk dihapus
    if (product.imageUrl) {
      await this.deleteImageFile(product.imageUrl);
    }
    
    return this.prisma.product.delete({ where: { id } });
  }

  // Helper: Hapus file gambar dari folder uploads
  private async deleteImageFile(imageUrl: string) {
    try {
      const fileName = imageUrl.replace('/uploads/products/', '');
      const filePath = join(process.cwd(), 'uploads', 'products', fileName);
      await fs.remove(filePath);
      console.log(`🗑️ Deleted image: ${filePath}`);
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  }
}