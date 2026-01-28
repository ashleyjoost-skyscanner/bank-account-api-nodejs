import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BankAccountController } from '../src/bank-account/bank-account.controller';
import { BankAccountService } from '../src/bank-account/bank-account.service';
import { BankAccount } from '../src/bank-account/bank-account.model';
import { createTestAccount } from '../src/bank-account/bank-account.factory';

describe('BankAccountController', () => {
  let controller: BankAccountController;
  let service: BankAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankAccountController],
      providers: [BankAccountService],
    }).compile();

    controller = module.get<BankAccountController>(BankAccountController);
    service = module.get<BankAccountService>(BankAccountService);
  });

  it('should return all bank accounts', () => {
    const accounts: BankAccount[] = [
      createTestAccount({ id: 1, accountNumber: '123', accountHolderName: 'John Doe', balance: 1000 }),
      createTestAccount({ id: 2, accountNumber: '456', accountHolderName: 'Jane Doe', balance: 2000 })
    ];

    jest.spyOn(service, 'getAllAccounts').mockReturnValue(accounts);

    expect(controller.getAllAccounts()).toEqual(accounts);
  });

  it('should return all account holders', () => {
    const holders = ['John Doe', 'Jane Doe'];

    jest.spyOn(service, 'getAccountHolders').mockReturnValue(holders);

    expect(controller.getAccountHolders()).toEqual(holders);
  });

  it('should search accounts by holder name', () => {
    const accounts: BankAccount[] = [
      createTestAccount({ id: 1, accountNumber: '123', accountHolderName: 'John Doe', balance: 1000 })
    ];

    jest.spyOn(service, 'searchByAccountHolder').mockReturnValue(accounts);

    expect(controller.searchByAccountHolder('John')).toEqual(accounts);
  });

  it('should throw BadRequestException when search name is empty', () => {
    expect(() => controller.searchByAccountHolder('')).toThrow();
  });

  it('should return a bank account by ID', () => {
    const account = createTestAccount({ id: 1, accountNumber: '123', accountHolderName: 'John Doe', balance: 1000 });

    jest.spyOn(service, 'getAccountById').mockReturnValue(account);

    expect(controller.getAccountById('1').id).toEqual(account.id);
  });

  it('should create a new bank account', () => {
    const account = createTestAccount({ id: 3, accountNumber: '789', accountHolderName: 'Alice Doe', balance: 3000 });

    jest.spyOn(service, 'createAccount').mockImplementation(() => {});

    expect(() => controller.createAccount(account)).not.toThrow();
  });

  it('should update an existing bank account', () => {
    const account = createTestAccount({ id: 1, accountNumber: '123', accountHolderName: 'John Doe Updated', balance: 1500 });

    jest.spyOn(service, 'updateAccount').mockImplementation(() => {});

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as any;
    expect(() => controller.updateAccount('1', account, res)).not.toThrow();
  });

  it('should delete an existing bank account', () => {
    jest.spyOn(service, 'deleteAccount').mockImplementation(() => {});

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as any;
    expect(() => controller.deleteAccount('1', res)).not.toThrow();
  });

  // Validation tests
  describe('Input Validation', () => {
    it('should throw BadRequestException when getAccountById receives invalid ID', () => {
      expect(() => controller.getAccountById('abc')).toThrow(BadRequestException);
      expect(() => controller.getAccountById('abc')).toThrow('Invalid account ID');
    });

    it('should throw BadRequestException when createAccount is missing accountNumber', () => {
      const account = { accountHolderName: 'John Doe', balance: 1000 } as BankAccount;
      expect(() => controller.createAccount(account)).toThrow(BadRequestException);
      expect(() => controller.createAccount(account)).toThrow('Account number is required');
    });

    it('should throw BadRequestException when createAccount is missing accountHolderName', () => {
      const account = { accountNumber: '123', balance: 1000 } as BankAccount;
      expect(() => controller.createAccount(account)).toThrow(BadRequestException);
      expect(() => controller.createAccount(account)).toThrow('Account holder name is required');
    });

    it('should throw BadRequestException when createAccount is missing balance', () => {
      const account = { accountNumber: '123', accountHolderName: 'John Doe' } as BankAccount;
      expect(() => controller.createAccount(account)).toThrow(BadRequestException);
      expect(() => controller.createAccount(account)).toThrow('Balance is required');
    });

    it('should throw BadRequestException when createAccount has negative balance', () => {
      const account = { accountNumber: '123', accountHolderName: 'John Doe', balance: -100 } as BankAccount;
      expect(() => controller.createAccount(account)).toThrow(BadRequestException);
      expect(() => controller.createAccount(account)).toThrow('Balance cannot be negative');
    });

    it('should return BAD_REQUEST when updateAccount has ID mismatch', () => {
      const account = createTestAccount({ id: 2, accountNumber: '123', accountHolderName: 'John Doe', balance: 1000 });
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as any;
      
      controller.updateAccount('1', account, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Account ID mismatch' });
    });

    it('should return BAD_REQUEST when updateAccount receives invalid ID', () => {
      const account = createTestAccount({ id: 1, accountNumber: '123', accountHolderName: 'John Doe', balance: 1000 });
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as any;
      
      controller.updateAccount('abc', account, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Account ID mismatch' });
    });

    it('should return BAD_REQUEST when deleteAccount receives invalid ID', () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn(), send: jest.fn() } as any;
      
      controller.deleteAccount('abc', res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid account ID' });
    });
  });
});
