import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('vouchers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateVoucherDto) {
    return this.vouchersService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.vouchersService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.findOne(id);
  }

  @Patch(':id/toggle')
  @Roles(Role.ADMIN)
  toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.vouchersService.toggleActive(id);
  }
}