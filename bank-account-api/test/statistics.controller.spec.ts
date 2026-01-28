import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from '../src/statistics/statistics.controller';
import { StatisticsService } from '../src/statistics/statistics.service';
import { BankAccountService } from '../src/bank-account/bank-account.service';
import { createTestAccount } from '../src/bank-account/bank-account.factory';
import { BadRequestException } from '@nestjs/common';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let service: StatisticsService;
  let bankAccountService: BankAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [StatisticsService, BankAccountService],
    }).compile();

    controller = module.get<StatisticsController>(StatisticsController);
    service = module.get<StatisticsService>(StatisticsService);
    bankAccountService = module.get<BankAccountService>(BankAccountService);
    bankAccountService.initializeAccounts([]);
  });

  it('should return statistics', () => {
    const accounts = [
      createTestAccount({ id: 1, accountNumber: 'ACC001', accountHolderName: 'John Doe', balance: 1000 }),
      createTestAccount({ id: 2, accountNumber: 'ACC002', accountHolderName: 'Jane Doe', balance: 2000 }),
    ];
    bankAccountService.initializeAccounts(accounts);

    const result = controller.getStatistics();

    expect(result.totalAccounts).toBe(2);
    expect(result.totalBalance).toBe(3000);
  });

  it('should return summary', () => {
    const accounts = [createTestAccount({ id: 1, accountNumber: 'ACC001', accountHolderName: 'John Doe', balance: 1000 })];
    bankAccountService.initializeAccounts(accounts);

    const result = controller.getSummary();

    expect(result.overview).toBeDefined();
    expect(result.distribution).toBeDefined();
    expect(result.topHolders).toBeDefined();
  });

  it('should return balance distribution', () => {
    const accounts = [
      createTestAccount({ id: 1, accountNumber: 'ACC001', accountHolderName: 'John Doe', balance: 500 }),
      createTestAccount({ id: 2, accountNumber: 'ACC002', accountHolderName: 'Jane Doe', balance: 5500 }),
    ];
    bankAccountService.initializeAccounts(accounts);

    const result = controller.getBalanceDistribution();

    expect(result.length).toBe(4);
  });

  it('should return top account holders with default limit', () => {
    const result = controller.getTopAccountHolders();

    expect(result).toBeDefined();
  });

  it('should return top account holders with custom limit', () => {
    const accounts = [
      createTestAccount({ id: 1, accountNumber: 'ACC001', accountHolderName: 'John Doe', balance: 1000 }),
      createTestAccount({ id: 2, accountNumber: 'ACC002', accountHolderName: 'Jane Doe', balance: 2000 }),
      createTestAccount({ id: 3, accountNumber: 'ACC003', accountHolderName: 'Bob Smith', balance: 3000 }),
    ];
    bankAccountService.initializeAccounts(accounts);

    const result = controller.getTopAccountHolders('2');

    expect(result.length).toBe(2);
  });

  it('should throw error for invalid limit', () => {
    expect(() => controller.getTopAccountHolders('invalid')).toThrow(BadRequestException);
  });
});
