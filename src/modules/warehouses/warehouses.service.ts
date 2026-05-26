import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class WarehousesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({
      data: {
        name: dto.name,
        location: dto.location,
        adminId: dto.adminId,
      },
      include: { admin: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async findAll() {
    return this.prisma.warehouse.findMany({
      include: {
        stocks: { include: { variant: { include: { product: true } } } },
        admin: { select: { id: true, fullName: true, email: true } },
      },
    });
  }

  async findOne(id: number) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        stocks: { include: { variant: { include: { product: true } } } },
        admin: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return warehouse;
  }

  async updateStock(dto: UpdateStockDto) {
    // Upsert stock: kalau belum ada buat, kalau sudah ada tambahkan
    return this.prisma.warehouseStock.upsert({
      where: {
        warehouseId_variantId: {
          warehouseId: dto.warehouseId,
          variantId: dto.variantId,
        },
      },
      update: {
        quantity: { increment: dto.quantity },
      },
      create: {
        warehouseId: dto.warehouseId,
        variantId: dto.variantId,
        quantity: dto.quantity,
      },
    });
  }
}