import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from '../src/statistics/statistics.controller';
import { StatisticsService } from '../src/statistics/statistics.service';
import { BankAccountService } from '../src/bank-account/bank-account.service';
import { BankAccount } from '../src/bank-account/bank-account.model';
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
      new BankAccount(1, 'ACC001', 'John Doe', 1000),
      new BankAccount(2, 'ACC002', 'Jane Doe', 2000),
    ];
    bankAccountService.initializeAccounts(accounts);

    const result = controller.getStatistics();

    expect(result.totalAccounts).toBe(2);
    expect(result.totalBalance).toBe(3000);
  });

  it('should return summary', () => {
    const accounts = [new BankAccount(1, 'ACC001', 'John Doe', 1000)];
    bankAccountService.initializeAccounts(accounts);

    const result = controller.getSummary();

    expect(result.overview).toBeDefined();
    expect(result.distribution).toBeDefined();
    expect(result.topHolders).toBeDefined();
  });

  it('should return balance distribution', () => {
    const accounts = [
      new BankAccount(1, 'ACC001', 'John Doe', 500),
      new BankAccount(2, 'ACC002', 'Jane Doe', 5500),
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
      new BankAccount(1, 'ACC001', 'John Doe', 1000),
      new BankAccount(2, 'ACC002', 'Jane Doe', 2000),
      new BankAccount(3, 'ACC003', 'Bob Smith', 3000),
    ];
    bankAccountService.initializeAccounts(accounts);

    const result = controller.getTopAccountHolders('2');

    expect(result.length).toBe(2);
  });

  it('should throw error for invalid limit', () => {
    expect(() => controller.getTopAccountHolders('invalid')).toThrow(BadRequestException);
  });
});
