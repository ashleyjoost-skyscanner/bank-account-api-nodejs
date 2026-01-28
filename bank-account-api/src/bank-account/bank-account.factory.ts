import { BankAccount } from './bank-account.model';

let idCounter = 1;

/**
 * Create a bank account with auto-generated ID and account number
 */
export function createBankAccount(
  accountHolderName: string,
  balance: number = 0,
): BankAccount {
  const id = idCounter++;
  const accountNumber = `ACC-${Date.now()}-${id}`;
  return new BankAccount(id, accountNumber, accountHolderName, balance);
}

/**
 * Create a savings account with SAV prefix
 */
export function createSavingsAccount(
  accountHolderName: string,
  initialDeposit: number,
): BankAccount {
  const id = idCounter++;
  const accountNumber = `SAV-${Date.now()}-${id}`;
  return new BankAccount(id, accountNumber, accountHolderName, initialDeposit);
}

/**
 * Create a checking account with CHK prefix and zero balance
 */
export function createCheckingAccount(accountHolderName: string): BankAccount {
  const id = idCounter++;
  const accountNumber = `CHK-${Date.now()}-${id}`;
  return new BankAccount(id, accountNumber, accountHolderName, 0);
}

/**
 * Create a test account with sensible defaults, allowing overrides
 */
export function createTestAccount(
  overrides: Partial<BankAccount> = {},
): BankAccount {
  return new BankAccount(
    overrides.id ?? 999,
    overrides.accountNumber ?? 'TEST-001',
    overrides.accountHolderName ?? 'Test User',
    overrides.balance ?? 1000,
  );
}

/**
 * Reset the ID counter (useful for testing)
 */
export function resetIdCounter(): void {
  idCounter = 1;
}
