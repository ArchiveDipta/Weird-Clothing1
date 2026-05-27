import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addToCart(userId: number, dto: AddToCartDto) {
    const existing = await this.prisma.cartItem.findFirst({
      where: { userId, variantId: dto.variantId },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: { increment: dto.quantity } },
        include: { variant: { include: { product: true } } },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        variantId: dto.variantId,
        quantity: dto.quantity,
      },
      include: { variant: { include: { product: true } } },
    });
  }

  async getCart(userId: number) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { variant: { include: { product: true } } },
    });
  }

  async removeFromCart(userId: number, cartItemId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { id: cartItemId, userId },
    });
  }

  async clearCart(userId: number) {
    return this.prisma.cartItem.deleteMany({
      where: { userId },
    });
  }
}