import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs-extra';
import { join } from 'path';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductImagesService {
  constructor(private prisma: PrismaService) {}

  async uploadImages(productId: number, files: Express.Multer.File[], altTexts?: string[]) {
    // Cek produk ada
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const images = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = `/uploads/products/${file.filename}`;
      const altText = altTexts?.[i] || product.name;

      const image = await this.prisma.productImage.create({
        data: {
          productId,
          imageUrl,
          altText,
          isPrimary: i === 0 && !(await this.hasPrimaryImage(productId)), // Gambar pertama jadi primary kalau belum ada
        },
      });
      images.push(image);
    }

    return images;
  }

  async getProductImages(productId: number) {
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { isPrimary: 'desc' },
    });
  }

  async setPrimaryImage(productId: number, imageId: number) {
    // Unset primary yang lama
    await this.prisma.productImage.updateMany({
      where: { productId, isPrimary: true },
      data: { isPrimary: false },
    });

    // Set primary yang baru
    return this.prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });
  }

  async deleteImage(imageId: number) {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });
    if (!image) throw new NotFoundException('Image not found');

    // Hapus file
    await this.deleteImageFile(image.imageUrl);

    return this.prisma.productImage.delete({
      where: { id: imageId },
    });
  }

  private async hasPrimaryImage(productId: number): Promise<boolean> {
    const count = await this.prisma.productImage.count({
      where: { productId, isPrimary: true },
    });
    return count > 0;
  }

  private async deleteImageFile(imageUrl: string) {
    try {
      const fileName = imageUrl.replace('/uploads/products/', '');
      const filePath = join(process.cwd(), 'uploads', 'products', fileName);
      await fs.remove(filePath);
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  }
}