import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from '../src/loan/loan.service';
import { Loan, LoanStatus } from '../src/loan/loan.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('LoanService', () => {
  let service: LoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoanService],
    }).compile();

    service = module.get<LoanService>(LoanService);
    service.initializeLoans([]);
  });

  describe('createLoan', () => {
    it('should create a loan with valid data', () => {
      const loan = service.createLoan({
        accountHolderName: 'John Doe',
        principalAmount: 10000,
        termMonths: 12,
      });

      expect(loan.accountHolderName).toBe('John Doe');
      expect(loan.principalAmount).toBe(10000);
      expect(loan.termMonths).toBe(12);
      expect(loan.status).toBe(LoanStatus.ACTIVE);
    });

    it('should use default interest rate when not provided', () => {
      const config = service.getConfiguration();
      const loan = service.createLoan({
        accountHolderName: 'John Doe',
        principalAmount: 10000,
        termMonths: 12,
      });

      expect(loan.interestRate).toBe(config.defaultInterestRate);
    });

    it('should use custom interest rate when provided', () => {
      const loan = service.createLoan({
        accountHolderName: 'John Doe',
        principalAmount: 10000,
        interestRate: 8.5,
        termMonths: 12,
      });

      expect(loan.interestRate).toBe(8.5);
    });

    it('should throw error for amount outside configured limits', () => {
      expect(() =>
        service.createLoan({
          accountHolderName: 'John Doe',
          principalAmount: 50,
          termMonths: 12,
        }),
      ).toThrow(BadRequestException);
    });

    it('should throw error for interest rate outside configured limits', () => {
      expect(() =>
        service.createLoan({
          accountHolderName: 'John Doe',
          principalAmount: 10000,
          interestRate: 50,
          termMonths: 12,
        }),
      ).toThrow(BadRequestException);
    });
  });

  describe('getLoanById', () => {
    it('should return loan when found', () => {
      const created = service.createLoan({
        accountHolderName: 'John Doe',
        principalAmount: 10000,
        termMonths: 12,
      });

      const found = service.getLoanById(created.id);
      expect(found.id).toBe(created.id);
    });

    it('should throw NotFoundException when loan not found', () => {
      expect(() => service.getLoanById(999)).toThrow(NotFoundException);
    });
  });

  describe('getLoansByAccountHolder', () => {
    it('should find loans by partial name match', () => {
      service.createLoan({
        accountHolderName: 'John Doe',
        principalAmount: 10000,
        termMonths: 12,
      });
      service.createLoan({
        accountHolderName: 'Jane Doe',
        principalAmount: 5000,
        termMonths: 6,
      });

      const doeLoans = service.getLoansByAccountHolder('Doe');
      expect(doeLoans.length).toBe(2);

      const johnLoans = service.getLoansByAccountHolder('John');
      expect(johnLoans.length).toBe(1);
    });
  });

  describe('makePayment', () => {
    it('should process payment successfully', () => {
      const loan = service.createLoan({
        accountHolderName: 'John Doe',
        principalAmount: 1000,
        termMonths: 12,
      });

      const payment = service.makePayment(loan.id, { amount: 100 });
      expect(payment.amount).toBe(100);
      expect(payment.remainingBalance).toBeLessThan(1000);
    });

    it('should throw error for invalid payment amount', () => {
      const loan = service.createLoan({
        accountHolderName: 'John Doe',
        principalAmount: 1000,
        termMonths: 12,
      });

      expect(() => service.makePayment(loan.id, { amount: 0 })).toThrow(
        BadRequestException,
      );
    });
  });

  describe('getPortfolioStats', () => {
    it('should calculate correct portfolio statistics', () => {
      service.createLoan({
        accountHolderName: 'John Doe',
        principalAmount: 10000,
        interestRate: 5,
        termMonths: 12,
      });
      service.createLoan({
        accountHolderName: 'Jane Doe',
        principalAmount: 20000,
        interestRate: 7,
        termMonths: 24,
      });

      const stats = service.getPortfolioStats();
      expect(stats.totalLoans).toBe(2);
      expect(stats.activeLoans).toBe(2);
      expect(stats.totalPrincipalLent).toBe(30000);
      expect(stats.totalOutstandingBalance).toBe(30000);
      expect(stats.averageInterestRate).toBe(6);
    });
  });

  describe('updateConfiguration', () => {
    it('should update configuration', () => {
      const updated = service.updateConfiguration({ defaultInterestRate: 10 });
      expect(updated.defaultInterestRate).toBe(10);
    });
  });
});
