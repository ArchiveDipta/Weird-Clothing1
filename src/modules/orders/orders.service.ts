import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // ======================== CHECKOUT ========================
  async checkout(userId: number, dto: CheckoutDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Validasi stok tersedia
      for (const item of dto.items) {
        const stock = await tx.warehouseStock.findUnique({
          where: {
            warehouseId_variantId: {
              warehouseId: item.warehouseId,
              variantId: item.variantId,
            },
          },
        });

        if (!stock || stock.quantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for variant ${item.variantId} at warehouse ${item.warehouseId}. Available: ${stock?.quantity ?? 0}`
          );
        }
      }

      // 2. Hitung total harga
      let totalAmount = new Prisma.Decimal(0);
      const orderItemsData = [];

      for (const item of dto.items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant) throw new NotFoundException(`Variant ${item.variantId} not found`);

        const unitPrice = variant.product.basePrice;
        const itemTotal = unitPrice.mul(item.quantity);
        totalAmount = totalAmount.add(itemTotal);

        orderItemsData.push({
          variantId: item.variantId,
          warehouseId: item.warehouseId,
          quantity: item.quantity,
          unitPrice,
        });
      }

      // 3. Validasi & Hitung Voucher
      let discountAmount = new Prisma.Decimal(0);
      let voucherId: number | null = null;

      if (dto.voucherCode) {
        const voucher = await tx.voucher.findUnique({
          where: { code: dto.voucherCode.toUpperCase() },
        });

        if (!voucher || !voucher.isActive) {
          throw new BadRequestException('Invalid voucher code');
        }

        const now = new Date();
        if (now < voucher.validFrom || now > voucher.validUntil) {
          throw new BadRequestException('Voucher expired or not yet active');
        }

        if (voucher.minPurchase && totalAmount.lessThan(voucher.minPurchase)) {
          throw new BadRequestException(`Minimum purchase ${voucher.minPurchase} required`);
        }

        if (voucher.usageLimit && voucher.usageCount >= voucher.usageLimit) {
          throw new BadRequestException('Voucher usage limit reached');
        }

        if (voucher.type === 'PERCENTAGE') {
          const calculated = totalAmount.mul(voucher.value).div(100);
          discountAmount = voucher.maxDiscount && calculated.greaterThan(voucher.maxDiscount)
            ? voucher.maxDiscount
            : calculated;
        } else {
          discountAmount = voucher.value;
        }

        voucherId = voucher.id;
      }

      const finalAmount = totalAmount.sub(discountAmount);
      if (finalAmount.lessThan(0)) discountAmount = totalAmount;

      // 4. Buat Order
      const order = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING_PAYMENT,
          totalAmount,
          discountAmount,
          finalAmount: totalAmount.sub(discountAmount),
          voucherId,
          shippingAddress: dto.shippingAddress,
          items: { create: orderItemsData },
        },
        include: {
          items: {
            include: {
              variant: { include: { product: true } },
              warehouse: true,
            },
          },
        },
      });

      // 5. Update voucher usage
      if (voucherId) {
        await tx.voucher.update({
          where: { id: voucherId },
          data: { usageCount: { increment: 1 } },
        });
      }

      return order;
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  }

  // ======================== SIMULATE PAYMENT ========================
  async simulatePayment(orderId: number) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) throw new NotFoundException('Order not found');
      if (order.status !== OrderStatus.PENDING_PAYMENT) {
        throw new BadRequestException(`Order already processed with status: ${order.status}`);
      }

      // Decrement stock
      for (const item of order.items) {
        const stock = await tx.warehouseStock.findUnique({
          where: {
            warehouseId_variantId: {
              warehouseId: item.warehouseId,
              variantId: item.variantId,
            },
          },
        });

        if (!stock || stock.quantity < item.quantity) {
          throw new BadRequestException(`Payment failed: Stock for variant ${item.variantId} is no longer available`);
        }

        await tx.warehouseStock.update({
          where: {
            warehouseId_variantId: {
              warehouseId: item.warehouseId,
              variantId: item.variantId,
            },
          },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID },
      });

      return {
        success: true,
        message: 'Payment simulated successfully',
        order: updatedOrder,
      };
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  }

  // ======================== CANCEL ORDER ========================
  async cancelOrder(orderId: number) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) throw new NotFoundException('Order not found');

      if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.PENDING_PAYMENT) {
        throw new BadRequestException(`Cannot cancel order with status: ${order.status}`);
      }

      // Jika PAID, kembalikan stok
      if (order.status === OrderStatus.PAID) {
        for (const item of order.items) {
          await tx.warehouseStock.update({
            where: {
              warehouseId_variantId: {
                warehouseId: item.warehouseId,
                variantId: item.variantId,
              },
            },
            data: { quantity: { increment: item.quantity } },
          });
        }
      }

      // Jika PENDING_PAYMENT, kembalikan voucher usage
      if (order.status === OrderStatus.PENDING_PAYMENT && order.voucherId) {
        await tx.voucher.update({
          where: { id: order.voucherId },
          data: { usageCount: { decrement: 1 } },
        });
      }

      const cancelledOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });

      return {
        success: true,
        message: 'Order cancelled and stock restored',
        order: cancelledOrder,
      };
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  }

  // ======================== GET ORDERS ========================
  async findAll(userId?: number) {
    const where = userId ? { userId } : {};
    return this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
            warehouse: true,
          },
        },
        user: { select: { id: true, fullName: true, email: true } },
        voucher: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId?: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
            warehouse: true,
          },
        },
        user: { select: { id: true, fullName: true, email: true } },
        voucher: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (userId && order.userId !== userId) throw new BadRequestException('Access denied');
    return order;
  }
}