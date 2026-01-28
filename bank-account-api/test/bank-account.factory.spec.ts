import { BankAccount } from '../src/bank-account/bank-account.model';
import {
  createBankAccount,
  createSavingsAccount,
  createCheckingAccount,
  createTestAccount,
} from '../src/bank-account/bank-account.factory';

describe('BankAccountFactory', () => {
  describe('createBankAccount', () => {
    it('should create an account with generated id and account number', () => {
      const account = createBankAccount('John Doe', 1000);

      expect(account).toBeInstanceOf(BankAccount);
      expect(account.id).toBeDefined();
      expect(account.accountNumber).toBeDefined();
      expect(account.accountHolderName).toBe('John Doe');
      expect(account.balance).toBe(1000);
    });

    it('should create an account with zero balance by default', () => {
      const account = createBankAccount('Jane Doe');

      expect(account.balance).toBe(0);
    });

    it('should generate unique ids for each account', () => {
      const account1 = createBankAccount('User 1');
      const account2 = createBankAccount('User 2');

      expect(account1.id).not.toBe(account2.id);
    });

    it('should generate unique account numbers', () => {
      const account1 = createBankAccount('User 1');
      const account2 = createBankAccount('User 2');

      expect(account1.accountNumber).not.toBe(account2.accountNumber);
    });
  });

  describe('createSavingsAccount', () => {
    it('should create a savings account with SAV prefix', () => {
      const account = createSavingsAccount('John Doe', 5000);

      expect(account.accountNumber).toMatch(/^SAV-/);
      expect(account.accountHolderName).toBe('John Doe');
      expect(account.balance).toBe(5000);
    });
  });

  describe('createCheckingAccount', () => {
    it('should create a checking account with CHK prefix', () => {
      const account = createCheckingAccount('Jane Doe');

      expect(account.accountNumber).toMatch(/^CHK-/);
      expect(account.accountHolderName).toBe('Jane Doe');
    });

    it('should create checking account with zero balance by default', () => {
      const account = createCheckingAccount('Jane Doe');

      expect(account.balance).toBe(0);
    });
  });

  describe('createTestAccount', () => {
    it('should create a test account with default values', () => {
      const account = createTestAccount();

      expect(account.id).toBe(999);
      expect(account.accountNumber).toBe('TEST-001');
      expect(account.accountHolderName).toBe('Test User');
      expect(account.balance).toBe(1000);
    });

    it('should allow overriding specific fields', () => {
      const account = createTestAccount({ balance: 5000 });

      expect(account.id).toBe(999);
      expect(account.accountNumber).toBe('TEST-001');
      expect(account.accountHolderName).toBe('Test User');
      expect(account.balance).toBe(5000);
    });

    it('should allow overriding all fields', () => {
      const account = createTestAccount({
        id: 1,
        accountNumber: 'CUSTOM-001',
        accountHolderName: 'Custom User',
        balance: 9999,
      });

      expect(account.id).toBe(1);
      expect(account.accountNumber).toBe('CUSTOM-001');
      expect(account.accountHolderName).toBe('Custom User');
      expect(account.balance).toBe(9999);
    });
  });
});
