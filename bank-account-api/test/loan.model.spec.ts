import { Loan, LoanStatus } from '../src/loan/loan.model';

describe('Loan Model', () => {
  describe('constructor', () => {
    it('should create a loan with correct properties', () => {
      const loan = new Loan(1, 'LOAN-001', 'John Doe', 10000, 5.5, 12);

      expect(loan.id).toBe(1);
      expect(loan.loanNumber).toBe('LOAN-001');
      expect(loan.accountHolderName).toBe('John Doe');
      expect(loan.principalAmount).toBe(10000);
      expect(loan.interestRate).toBe(5.5);
      expect(loan.termMonths).toBe(12);
      expect(loan.outstandingBalance).toBe(10000);
      expect(loan.status).toBe(LoanStatus.ACTIVE);
      expect(loan.payments).toEqual([]);
    });

    it('should throw error for non-positive principal', () => {
      expect(() => new Loan(1, 'LOAN-001', 'John Doe', 0, 5.5, 12)).toThrow(
        'Principal amount must be positive',
      );
      expect(() => new Loan(1, 'LOAN-001', 'John Doe', -100, 5.5, 12)).toThrow(
        'Principal amount must be positive',
      );
    });

    it('should throw error for negative interest rate', () => {
      expect(() => new Loan(1, 'LOAN-001', 'John Doe', 10000, -1, 12)).toThrow(
        'Interest rate cannot be negative',
      );
    });

    it('should throw error for non-positive term', () => {
      expect(() => new Loan(1, 'LOAN-001', 'John Doe', 10000, 5.5, 0)).toThrow(
        'Term must be at least 1 month',
      );
    });
  });

  describe('calculateMonthlyPayment', () => {
    it('should calculate correct monthly payment', () => {
      const loan = new Loan(1, 'LOAN-001', 'John Doe', 10000, 12, 12);
      const monthlyPayment = loan.calculateMonthlyPayment();

      // Expected: ~$888.49 for $10,000 at 12% APR for 12 months
      expect(monthlyPayment).toBeCloseTo(888.49, 0);
    });

    it('should handle zero interest rate', () => {
      const loan = new Loan(1, 'LOAN-001', 'John Doe', 12000, 0, 12);
      const monthlyPayment = loan.calculateMonthlyPayment();

      expect(monthlyPayment).toBe(1000);
    });
  });

  describe('makePayment', () => {
    it('should record payment and reduce balance', () => {
      const loan = new Loan(1, 'LOAN-001', 'John Doe', 1000, 12, 12);
      const payment = loan.makePayment(100);

      expect(payment.amount).toBe(100);
      expect(payment.interestPaid).toBeGreaterThan(0);
      expect(payment.principalPaid).toBeGreaterThan(0);
      expect(loan.outstandingBalance).toBeLessThan(1000);
      expect(loan.payments.length).toBe(1);
    });

    it('should throw error for non-positive payment', () => {
      const loan = new Loan(1, 'LOAN-001', 'John Doe', 1000, 12, 12);

      expect(() => loan.makePayment(0)).toThrow('Payment amount must be positive');
      expect(() => loan.makePayment(-50)).toThrow('Payment amount must be positive');
    });

    it('should mark loan as paid off when balance reaches zero', () => {
      const loan = new Loan(1, 'LOAN-001', 'John Doe', 100, 0, 1);
      loan.makePayment(100);

      expect(loan.outstandingBalance).toBe(0);
      expect(loan.status).toBe(LoanStatus.PAID_OFF);
    });

    it('should throw error when paying inactive loan', () => {
      const loan = new Loan(1, 'LOAN-001', 'John Doe', 100, 0, 1);
      loan.makePayment(100); // Pays off loan

      expect(() => loan.makePayment(50)).toThrow('Cannot make payment on inactive loan');
    });
  });

  describe('getSummary', () => {
    it('should return comprehensive loan summary', () => {
      const loan = new Loan(1, 'LOAN-001', 'John Doe', 10000, 5.5, 24);
      const summary = loan.getSummary();

      expect(summary.loanNumber).toBe('LOAN-001');
      expect(summary.accountHolderName).toBe('John Doe');
      expect(summary.principalAmount).toBe(10000);
      expect(summary.interestRate).toBe(5.5);
      expect(summary.termMonths).toBe(24);
      expect(summary.monthlyPayment).toBeGreaterThan(0);
      expect(summary.totalInterest).toBeGreaterThan(0);
      expect(summary.status).toBe(LoanStatus.ACTIVE);
    });
  });
});
