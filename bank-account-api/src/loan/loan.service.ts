import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Loan, LoanStatus, LoanPayment } from './loan.model';
import { LoanConfigService, DEFAULT_LOAN_CONFIG } from './loan.config';

export interface CreateLoanDto {
  accountHolderName: string;
  principalAmount: number;
  interestRate?: number;
  termMonths: number;
}

export interface MakePaymentDto {
  amount: number;
}

@Injectable()
export class LoanService {
  private static loans: Loan[] = [];
  private configService: LoanConfigService;

  constructor() {
    this.configService = new LoanConfigService();
  }

  // Configuration methods
  getConfiguration() {
    return this.configService.getConfig();
  }

  updateConfiguration(updates: Partial<typeof DEFAULT_LOAN_CONFIG>) {
    this.configService.updateConfig(updates);
    return this.configService.getConfig();
  }

  // Loan CRUD operations
  getAllLoans(): Loan[] {
    return LoanService.loans;
  }

  getLoanById(id: number): Loan {
    const loan = LoanService.loans.find(l => l.id === id);
    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }
    return loan;
  }

  getLoansByAccountHolder(name: string): Loan[] {
    const searchTerm = name.toLowerCase();
    return LoanService.loans.filter(l =>
      l.accountHolderName.toLowerCase().includes(searchTerm),
    );
  }

  getActiveLoans(): Loan[] {
    return LoanService.loans.filter(l => l.status === LoanStatus.ACTIVE);
  }

  createLoan(dto: CreateLoanDto): Loan {
    // Validate principal amount
    if (!this.configService.validateLoanAmount(dto.principalAmount)) {
      const config = this.configService.getConfig();
      throw new BadRequestException(
        `Loan amount must be between $${config.minLoanAmount} and $${config.maxLoanAmount}`,
      );
    }

    // Validate term
    if (!this.configService.validateTerm(dto.termMonths)) {
      const config = this.configService.getConfig();
      throw new BadRequestException(
        `Loan term must be between ${config.minTermMonths} and ${config.maxTermMonths} months`,
      );
    }

    // Use provided interest rate or default
    const interestRate = dto.interestRate ?? this.configService.getDefaultInterestRate();

    // Validate interest rate
    if (!this.configService.validateInterestRate(interestRate)) {
      const config = this.configService.getConfig();
      throw new BadRequestException(
        `Interest rate must be between ${config.minInterestRate}% and ${config.maxInterestRate}%`,
      );
    }

    const loanNumber = `LOAN-${Date.now()}-${LoanService.loans.length + 1}`;
    const loan = new Loan(
      LoanService.loans.length + 1,
      loanNumber,
      dto.accountHolderName,
      dto.principalAmount,
      interestRate,
      dto.termMonths,
    );

    LoanService.loans.push(loan);
    return loan;
  }

  makePayment(loanId: number, dto: MakePaymentDto): LoanPayment {
    const loan = this.getLoanById(loanId);
    
    if (dto.amount <= 0) {
      throw new BadRequestException('Payment amount must be positive');
    }

    try {
      return loan.makePayment(dto.amount);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getPaymentHistory(loanId: number): LoanPayment[] {
    const loan = this.getLoanById(loanId);
    return loan.payments;
  }

  getLoanSummary(loanId: number) {
    const loan = this.getLoanById(loanId);
    return loan.getSummary();
  }

  // Portfolio statistics
  getPortfolioStats() {
    const loans = LoanService.loans;
    const activeLoans = loans.filter(l => l.status === LoanStatus.ACTIVE);
    const paidOffLoans = loans.filter(l => l.status === LoanStatus.PAID_OFF);

    const totalPrincipal = loans.reduce((sum, l) => sum + l.principalAmount, 0);
    const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.outstandingBalance, 0);
    const averageInterestRate =
      loans.length > 0
        ? loans.reduce((sum, l) => sum + l.interestRate, 0) / loans.length
        : 0;

    return {
      totalLoans: loans.length,
      activeLoans: activeLoans.length,
      paidOffLoans: paidOffLoans.length,
      totalPrincipalLent: totalPrincipal,
      totalOutstandingBalance: totalOutstanding,
      averageInterestRate: Math.round(averageInterestRate * 100) / 100,
    };
  }

  // For testing
  initializeLoans(loans: Loan[]): void {
    LoanService.loans = loans;
  }
}
