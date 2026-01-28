export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  PAID_OFF = 'PAID_OFF',
  DEFAULTED = 'DEFAULTED',
}

export interface LoanPayment {
  date: string;
  amount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export class Loan {
  id: number;
  loanNumber: string;
  accountHolderName: string;
  principalAmount: number;
  interestRate: number; // Annual percentage rate (e.g., 5.5 for 5.5%)
  termMonths: number;
  outstandingBalance: number;
  status: LoanStatus;
  createdAt: string;
  payments: LoanPayment[];

  constructor(
    id: number,
    loanNumber: string,
    accountHolderName: string,
    principalAmount: number,
    interestRate: number,
    termMonths: number,
  ) {
    if (principalAmount <= 0) {
      throw new Error('Principal amount must be positive');
    }
    if (interestRate < 0) {
      throw new Error('Interest rate cannot be negative');
    }
    if (termMonths <= 0) {
      throw new Error('Term must be at least 1 month');
    }

    this.id = id;
    this.loanNumber = loanNumber;
    this.accountHolderName = accountHolderName;
    this.principalAmount = principalAmount;
    this.interestRate = interestRate;
    this.termMonths = termMonths;
    this.outstandingBalance = principalAmount;
    this.status = LoanStatus.ACTIVE;
    this.createdAt = new Date().toISOString();
    this.payments = [];
  }

  /**
   * Calculate monthly payment using amortization formula
   */
  calculateMonthlyPayment(): number {
    const monthlyRate = this.interestRate / 100 / 12;
    if (monthlyRate === 0) {
      return this.principalAmount / this.termMonths;
    }
    const payment =
      (this.principalAmount * monthlyRate * Math.pow(1 + monthlyRate, this.termMonths)) /
      (Math.pow(1 + monthlyRate, this.termMonths) - 1);
    return Math.round(payment * 100) / 100;
  }

  /**
   * Calculate interest portion of current payment
   */
  calculateCurrentInterest(): number {
    const monthlyRate = this.interestRate / 100 / 12;
    return Math.round(this.outstandingBalance * monthlyRate * 100) / 100;
  }

  /**
   * Make a payment on the loan
   */
  makePayment(amount: number): LoanPayment {
    if (amount <= 0) {
      throw new Error('Payment amount must be positive');
    }
    if (this.status !== LoanStatus.ACTIVE) {
      throw new Error('Cannot make payment on inactive loan');
    }
    if (amount > this.outstandingBalance + this.calculateCurrentInterest()) {
      throw new Error('Payment exceeds total amount owed');
    }

    const interestPaid = Math.min(amount, this.calculateCurrentInterest());
    const principalPaid = amount - interestPaid;
    this.outstandingBalance = Math.round((this.outstandingBalance - principalPaid) * 100) / 100;

    if (this.outstandingBalance <= 0) {
      this.outstandingBalance = 0;
      this.status = LoanStatus.PAID_OFF;
    }

    const payment: LoanPayment = {
      date: new Date().toISOString(),
      amount,
      principalPaid,
      interestPaid,
      remainingBalance: this.outstandingBalance,
    };

    this.payments.push(payment);
    return payment;
  }

  /**
   * Calculate total interest over loan lifetime
   */
  calculateTotalInterest(): number {
    const monthlyPayment = this.calculateMonthlyPayment();
    const totalPayments = monthlyPayment * this.termMonths;
    return Math.round((totalPayments - this.principalAmount) * 100) / 100;
  }

  /**
   * Get loan summary
   */
  getSummary() {
    return {
      loanNumber: this.loanNumber,
      accountHolderName: this.accountHolderName,
      principalAmount: this.principalAmount,
      interestRate: this.interestRate,
      termMonths: this.termMonths,
      monthlyPayment: this.calculateMonthlyPayment(),
      outstandingBalance: this.outstandingBalance,
      totalInterest: this.calculateTotalInterest(),
      status: this.status,
      paymentsMade: this.payments.length,
    };
  }
}
