import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { IsAuthGuard } from 'src/common/guards/isAuth.guard';
import { UserId } from 'src/users/decorators/user.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @UseGuards(IsAuthGuard)
  getAllInformation(@UserId() userId) {
    return this.analyticsService.getAllInformation(userId);
  }
}
