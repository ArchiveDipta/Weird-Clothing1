import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';

@Injectable()
export class VouchersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVoucherDto) {
    return this.prisma.voucher.create({
      data: {
        code: dto.code.toUpperCase(),
        type: dto.type,
        value: dto.value,
        minPurchase: dto.minPurchase,
        maxDiscount: dto.maxDiscount,
        validFrom: new Date(dto.validFrom),
        validUntil: new Date(dto.validUntil),
        usageLimit: dto.usageLimit,
      },
    });
  }

  async findAll() {
    return this.prisma.voucher.findMany();
  }

  async findOne(id: number) {
    const voucher = await this.prisma.voucher.findUnique({ where: { id } });
    if (!voucher) throw new NotFoundException('Voucher not found');
    return voucher;
  }

  async toggleActive(id: number) {
    const voucher = await this.findOne(id);
    return this.prisma.voucher.update({
      where: { id },
      data: { isActive: !voucher.isActive },
    });
  }
}