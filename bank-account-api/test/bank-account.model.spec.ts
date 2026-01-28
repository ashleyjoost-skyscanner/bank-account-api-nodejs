import { BankAccount } from '../src/bank-account/bank-account.model';
import { TransactionType } from '../src/bank-account/transaction-type.enum';

describe('BankAccount Model', () => {
  let account: BankAccount;

  beforeEach(() => {
    account = new BankAccount(1, '123456', 'John Doe', 1000);
  });

  it('should deposit money correctly with Credit', () => {
    account.deposit(500, TransactionType.Credit);
    expect(account.balance).toBe(1500);
  });

  it('should deposit money correctly with TransferCredit', () => {
    account.deposit(500, TransactionType.TransferCredit);
    expect(account.balance).toBe(1500);
  });

  it('should throw an error when depositing with wrong transaction type', () => {
    expect(() => account.deposit(500, TransactionType.Debit)).toThrow('Transaction type must be Credit or TransferCredit.');
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

  it('should throw an error when withdrawing with wrong transaction type', () => {
    expect(() => account.withdraw(500, TransactionType.Credit)).toThrow('Transaction type must be Debit or ATMDebit.');
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
});
