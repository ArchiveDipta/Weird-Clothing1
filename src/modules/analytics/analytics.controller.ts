import { Controller, Get, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboardSummary() {
    return this.analyticsService.getDashboardSummary();
  }

  @Get('top-products')
  getTopProducts(@Query('limit', ParseIntPipe) limit?: number) {
    return this.analyticsService.getTopProducts(limit || 5);
  }
}