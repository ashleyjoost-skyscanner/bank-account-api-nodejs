import { BankAccount } from '../src/bank-account/bank-account.model';
import { TransactionType } from '../src/bank-account/transaction-type.enum';

describe('BankAccount Model', () => {
  let account: BankAccount;

  beforeEach(() => {
    account = new BankAccount(1, '123456', 'John Doe', 1000);
  });

  it('should create an account with correct properties', () => {
    const newAccount = new BankAccount(5, '999999', 'Test User', 500);
    expect(newAccount.id).toBe(5);
    expect(newAccount.accountNumber).toBe('999999');
    expect(newAccount.accountHolderName).toBe('Test User');
    expect(newAccount.balance).toBe(500);
  });

  it('should allow zero initial balance', () => {
    const newAccount = new BankAccount(1, '123456', 'John Doe', 0);
    expect(newAccount.balance).toBe(0);
  });

  it('should allow negative initial balance', () => {
    const newAccount = new BankAccount(1, '123456', 'John Doe', -100);
    expect(newAccount.balance).toBe(-100);
  });

  it('should deposit money correctly with Credit', () => {
    account.deposit(500, TransactionType.Credit);
    expect(account.balance).toBe(1500);
  });

  it('should deposit money correctly with TransferCredit', () => {
    account.deposit(500, TransactionType.TransferCredit);
    expect(account.balance).toBe(1500);
  });

  it('should handle decimal deposit amounts correctly', () => {
    account.deposit(100.5, TransactionType.Credit);
    expect(account.balance).toBe(1100.5);
  });

  it('should throw an error when deposit amount is zero', () => {
    expect(() => account.deposit(0, TransactionType.Credit)).toThrow('Deposit amount must be positive.');
  });

  it('should throw an error when deposit amount is negative', () => {
    expect(() => account.deposit(-100, TransactionType.Credit)).toThrow('Deposit amount must be positive.');
  });

  it('should throw an error when depositing with Debit transaction type', () => {
    expect(() => account.deposit(500, TransactionType.Debit)).toThrow('Transaction type must be Credit or TransferCredit.');
  });

  it('should throw an error when depositing with ATMDebit transaction type', () => {
    expect(() => account.deposit(500, TransactionType.ATMDebit)).toThrow('Transaction type must be Credit or TransferCredit.');
  });

  it('should withdraw money correctly with Debit', () => {
    account.withdraw(500, TransactionType.Debit);
    expect(account.balance).toBe(500);
  });

  it('should withdraw money correctly with ATMDebit', () => {
    account.withdraw(500, TransactionType.ATMDebit);
    expect(account.balance).toBe(500);
  });

  it('should withdraw entire balance correctly', () => {
    account.withdraw(1000, TransactionType.Debit);
    expect(account.balance).toBe(0);
  });

  it('should handle decimal withdrawal amounts correctly', () => {
    account.withdraw(100.5, TransactionType.Debit);
    expect(account.balance).toBe(899.5);
  });

  it('should throw an error when withdrawal amount is zero', () => {
    expect(() => account.withdraw(0, TransactionType.Debit)).toThrow('Withdrawal amount must be positive.');
  });

  it('should throw an error when withdrawal amount is negative', () => {
    expect(() => account.withdraw(-100, TransactionType.Debit)).toThrow('Withdrawal amount must be positive.');
  });

  it('should throw an error when withdrawing with Credit transaction type', () => {
    expect(() => account.withdraw(500, TransactionType.Credit)).toThrow('Transaction type must be Debit or ATMDebit.');
  });

  it('should throw an error when withdrawing with TransferCredit transaction type', () => {
    expect(() => account.withdraw(500, TransactionType.TransferCredit)).toThrow('Transaction type must be Debit or ATMDebit.');
  });

  it('should throw an error when withdrawing more than balance', () => {
    expect(() => account.withdraw(2000, TransactionType.Debit)).toThrow('Insufficient funds.');
  });

  it('should transfer money correctly', () => {
    const anotherAccount = new BankAccount(2, '654321', 'Jane Doe', 500);
    account.transfer(anotherAccount, 300);
    expect(account.balance).toBe(700);
    expect(anotherAccount.balance).toBe(800);
  });

  it('should transfer entire balance correctly', () => {
    const anotherAccount = new BankAccount(2, '654321', 'Jane Doe', 0);
    account.transfer(anotherAccount, 1000);
    expect(account.balance).toBe(0);
    expect(anotherAccount.balance).toBe(1000);
  });

  it('should handle decimal transfer amounts correctly', () => {
    const anotherAccount = new BankAccount(2, '654321', 'Jane Doe', 500);
    account.transfer(anotherAccount, 100.5);
    expect(account.balance).toBe(899.5);
    expect(anotherAccount.balance).toBe(600.5);
  });

  it('should throw an error when transfer amount is zero', () => {
    const anotherAccount = new BankAccount(2, '654321', 'Jane Doe', 500);
    expect(() => account.transfer(anotherAccount, 0)).toThrow('Transfer amount must be positive.');
  });

  it('should throw an error when transfer amount is negative', () => {
    const anotherAccount = new BankAccount(2, '654321', 'Jane Doe', 500);
    expect(() => account.transfer(anotherAccount, -100)).toThrow('Transfer amount must be positive.');
  });

  it('should throw an error when transfer amount exceeds balance', () => {
    const anotherAccount = new BankAccount(2, '654321', 'Jane Doe', 500);
    expect(() => account.transfer(anotherAccount, 1500)).toThrow('Insufficient funds.');
  });

  it('should not modify balances when transfer fails due to insufficient funds', () => {
    const anotherAccount = new BankAccount(2, '654321', 'Jane Doe', 500);
    try {
      account.transfer(anotherAccount, 1500);
    } catch {
      // Expected to throw
    }
    expect(account.balance).toBe(1000);
    expect(anotherAccount.balance).toBe(500);
  });

  it('should throw an error when destination account is null', () => {
    expect(() => account.transfer(null as unknown as BankAccount, 100)).toThrow('Destination account is required.');
  });

  it('should throw an error when destination account is undefined', () => {
    expect(() => account.transfer(undefined as unknown as BankAccount, 100)).toThrow('Destination account is required.');
  });
});
