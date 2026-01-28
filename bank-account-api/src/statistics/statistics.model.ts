export interface BankStatistics {
  totalAccounts: number;
  totalBalance: number;
  averageBalance: number;
  minBalance: number | null;
  maxBalance: number | null;
  medianBalance: number | null;
  standardDeviation: number | null;
  percentiles: Percentiles | null;
}

export interface Percentiles {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p99: number;
}

export interface BalanceDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface AccountHolderStats {
  holderName: string;
  accountCount: number;
  totalBalance: number;
  averageBalance: number;
}

export interface StatisticsSummary {
  overview: BankStatistics;
  distribution: BalanceDistribution[];
  topHolders: AccountHolderStats[];
  generatedAt: string;
}
