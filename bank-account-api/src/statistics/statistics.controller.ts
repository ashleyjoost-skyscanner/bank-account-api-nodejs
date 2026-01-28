import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { BankStatistics, BalanceDistribution, AccountHolderStats, StatisticsSummary } from './statistics.model';

@Controller('api/Statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  getStatistics(): BankStatistics {
    return this.statisticsService.getStatistics();
  }

  @Get('summary')
  getSummary(): StatisticsSummary {
    return this.statisticsService.getSummary();
  }

  @Get('distribution')
  getBalanceDistribution(): BalanceDistribution[] {
    return this.statisticsService.getBalanceDistribution();
  }

  @Get('top-holders')
  getTopAccountHolders(@Query('limit') limit?: string): AccountHolderStats[] {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    if (isNaN(parsedLimit)) {
      throw new BadRequestException('Limit must be a valid number');
    }
    return this.statisticsService.getTopAccountHolders(parsedLimit);
  }
}
