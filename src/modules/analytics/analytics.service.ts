import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary() {
    const [totalSalesAgg, totalOrders, totalProducts, totalCustomers] = await Promise.all([
      this.prisma.order.aggregate({
        where: { status: OrderStatus.PAID },
        _sum: { finalAmount: true },
      }),
      this.prisma.order.count({ where: { status: OrderStatus.PAID } }),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
    ]);

    return {
      totalRevenue: totalSalesAgg._sum.finalAmount ?? 0,
      totalPaidOrders: totalOrders,
      totalActiveProducts: totalProducts,
      totalCustomers,
    };
  }

  async getTopProducts(limit = 5) {
    const topProducts = await this.prisma.orderItem.groupBy({
      by: ['variantId'],
      where: { order: { status: OrderStatus.PAID } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const detailed = await Promise.all(
      topProducts.map(async (item) => {
        const variant = await this.prisma.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });
        return {
          variantId: item.variantId,
          sku: variant?.sku,
          productName: variant?.product.name,
          totalSold: item._sum.quantity,
        };
      }),
    );

    return detailed;
  }
}