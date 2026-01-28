import { Injectable, BadRequestException } from '@nestjs/common';
import { BankAccountService } from '../bank-account/bank-account.service';
import { BankStatistics, BalanceDistribution, AccountHolderStats, Percentiles, StatisticsSummary } from './statistics.model';

@Injectable()
export class StatisticsService {
  constructor(private readonly bankAccountService: BankAccountService) {}

  getStatistics(): BankStatistics {
    const accounts = this.bankAccountService.getAllAccounts();
    
    if (accounts.length === 0) {
      return {
        totalAccounts: 0,
        totalBalance: 0,
        averageBalance: 0,
        minBalance: null,
        maxBalance: null,
        medianBalance: null,
        standardDeviation: null,
        percentiles: null,
      };
    }

    const balances = accounts.map(a => a.balance);
    const totalBalance = balances.reduce((a, b) => a + b, 0);
    const averageBalance = totalBalance / accounts.length;
    
    return {
      totalAccounts: accounts.length,
      totalBalance,
      averageBalance,
      minBalance: Math.min(...balances),
      maxBalance: Math.max(...balances),
      medianBalance: this.calculateMedian(balances),
      standardDeviation: this.calculateStandardDeviation(balances, averageBalance),
      percentiles: this.calculatePercentiles(balances),
    };
  }

  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  private calculateStandardDeviation(values: number[], mean: number): number {
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  private calculatePercentile(sortedValues: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedValues.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sortedValues[lower];
    return sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * (index - lower);
  }

  private calculatePercentiles(values: number[]): Percentiles {
    const sorted = [...values].sort((a, b) => a - b);
    return {
      p25: this.calculatePercentile(sorted, 25),
      p50: this.calculatePercentile(sorted, 50),
      p75: this.calculatePercentile(sorted, 75),
      p90: this.calculatePercentile(sorted, 90),
      p99: this.calculatePercentile(sorted, 99),
    };
  }

  getBalanceDistribution(): BalanceDistribution[] {
    const accounts = this.bankAccountService.getAllAccounts();
    if (accounts.length === 0) return [];

    const ranges = [
      { min: 0, max: 1000, label: '$0 - $1,000' },
      { min: 1000, max: 5000, label: '$1,000 - $5,000' },
      { min: 5000, max: 10000, label: '$5,000 - $10,000' },
      { min: 10000, max: Infinity, label: '$10,000+' },
    ];

    return ranges.map(range => {
      const count = accounts.filter(a => a.balance >= range.min && a.balance < range.max).length;
      return {
        range: range.label,
        count,
        percentage: Math.round((count / accounts.length) * 10000) / 100,
      };
    });
  }

  getTopAccountHolders(limit: number = 5): AccountHolderStats[] {
    if (limit < 1 || limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    const accounts = this.bankAccountService.getAllAccounts();
    const holderMap = new Map<string, { count: number; total: number }>();

    accounts.forEach(acc => {
      const existing = holderMap.get(acc.accountHolderName) || { count: 0, total: 0 };
      holderMap.set(acc.accountHolderName, {
        count: existing.count + 1,
        total: existing.total + acc.balance,
      });
    });

    return Array.from(holderMap.entries())
      .map(([name, stats]) => ({
        holderName: name,
        accountCount: stats.count,
        totalBalance: stats.total,
        averageBalance: stats.total / stats.count,
      }))
      .sort((a, b) => b.totalBalance - a.totalBalance)
      .slice(0, limit);
  }

  getSummary(): StatisticsSummary {
    return {
      overview: this.getStatistics(),
      distribution: this.getBalanceDistribution(),
      topHolders: this.getTopAccountHolders(5),
      generatedAt: new Date().toISOString(),
    };
  }
}
