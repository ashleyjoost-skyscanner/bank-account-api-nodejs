export interface LoanConfiguration {
  defaultInterestRate: number;
  minInterestRate: number;
  maxInterestRate: number;
  maxLoanAmount: number;
  minLoanAmount: number;
  maxTermMonths: number;
  minTermMonths: number;
}

export const DEFAULT_LOAN_CONFIG: LoanConfiguration = {
  defaultInterestRate: 7.5,
  minInterestRate: 1.0,
  maxInterestRate: 25.0,
  maxLoanAmount: 1000000,
  minLoanAmount: 100,
  maxTermMonths: 360, // 30 years
  minTermMonths: 1,
};

export class LoanConfigService {
  private config: LoanConfiguration;

  constructor(config?: Partial<LoanConfiguration>) {
    this.config = { ...DEFAULT_LOAN_CONFIG, ...config };
  }

  getConfig(): LoanConfiguration {
    return { ...this.config };
  }

  updateConfig(updates: Partial<LoanConfiguration>): void {
    this.config = { ...this.config, ...updates };
  }

  validateInterestRate(rate: number): boolean {
    return rate >= this.config.minInterestRate && rate <= this.config.maxInterestRate;
  }

  validateLoanAmount(amount: number): boolean {
    return amount >= this.config.minLoanAmount && amount <= this.config.maxLoanAmount;
  }

  validateTerm(months: number): boolean {
    return months >= this.config.minTermMonths && months <= this.config.maxTermMonths;
  }

  getDefaultInterestRate(): number {
    return this.config.defaultInterestRate;
  }
}
