import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from '../src/statistics/statistics.service';
import { BankAccountService } from '../src/bank-account/bank-account.service';
import { createTestAccount } from '../src/bank-account/bank-account.factory';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let bankAccountService: BankAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatisticsService, BankAccountService],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    bankAccountService = module.get<BankAccountService>(BankAccountService);
    bankAccountService.initializeAccounts([]);
  });

  describe('getStatistics', () => {
    it('should return empty statistics when no accounts exist', () => {
      const result = service.getStatistics();

      expect(result.totalAccounts).toBe(0);
      expect(result.totalBalance).toBe(0);
      expect(result.averageBalance).toBe(0);
      expect(result.minBalance).toBeNull();
      expect(result.maxBalance).toBeNull();
      expect(result.medianBalance).toBeNull();
      expect(result.standardDeviation).toBeNull();
      expect(result.percentiles).toBeNull();
    });

    it('should calculate correct statistics for multiple accounts', () => {
      const accounts = [
        createTestAccount({ id: 1, accountNumber: 'ACC001', accountHolderName: 'John Doe', balance: 1000 }),
        createTestAccount({ id: 2, accountNumber: 'ACC002', accountHolderName: 'Jane Doe', balance: 2000 }),
        createTestAccount({ id: 3, accountNumber: 'ACC003', accountHolderName: 'Bob Smith', balance: 3000 }),
      ];
      bankAccountService.initializeAccounts(accounts);

      const result = service.getStatistics();

      expect(result.totalAccounts).toBe(3);
      expect(result.totalBalance).toBe(6000);
      expect(result.averageBalance).toBe(2000);
      expect(result.minBalance).toBe(1000);
      expect(result.maxBalance).toBe(3000);
      expect(result.medianBalance).toBe(2000);
      expect(result.percentiles).toBeDefined();
    });

    it('should calculate correct median for even number of accounts', () => {
      const accounts = [
        createTestAccount({ id: 1, accountNumber: 'ACC001', accountHolderName: 'John Doe', balance: 1000 }),
        createTestAccount({ id: 2, accountNumber: 'ACC002', accountHolderName: 'Jane Doe', balance: 2000 }),
        createTestAccount({ id: 3, accountNumber: 'ACC003', accountHolderName: 'Bob Smith', balance: 3000 }),
        createTestAccount({ id: 4, accountNumber: 'ACC004', accountHolderName: 'Alice Brown', balance: 4000 }),
      ];
      bankAccountService.initializeAccounts(accounts);

      const result = service.getStatistics();

      expect(result.medianBalance).toBe(2500);
    });
  });

  describe('getBalanceDistribution', () => {
    it('should return empty array when no accounts exist', () => {
      const result = service.getBalanceDistribution();

      expect(result).toEqual([]);
    });

    it('should categorize accounts into correct ranges', () => {
      const accounts = [
        createTestAccount({ id: 1, accountNumber: 'ACC001', accountHolderName: 'John Doe', balance: 500 }),
        createTestAccount({ id: 2, accountNumber: 'ACC002', accountHolderName: 'Jane Doe', balance: 2000 }),
        createTestAccount({ id: 3, accountNumber: 'ACC003', accountHolderName: 'Bob Smith', balance: 7500 }),
        createTestAccount({ id: 4, accountNumber: 'ACC004', accountHolderName: 'Alice Brown', balance: 15000 }),
      ];
      bankAccountService.initializeAccounts(accounts);

      const result = service.getBalanceDistribution();

      expect(result).toHaveLength(4);
      expect(result[0].range).toBe('$0 - $1,000');
      expect(result[0].count).toBe(1);
      expect(result[1].range).toBe('$1,000 - $5,000');
      expect(result[1].count).toBe(1);
      expect(result[2].range).toBe('$5,000 - $10,000');
      expect(result[2].count).toBe(1);
      expect(result[3].range).toBe('$10,000+');
      expect(result[3].count).toBe(1);
    });
  });

  describe('getTopAccountHolders', () => {
    it('should return top account holders by total balance', () => {
      const accounts = [
        createTestAccount({ id: 1, accountNumber: 'ACC001', accountHolderName: 'John Doe', balance: 5000 }),
        createTestAccount({ id: 2, accountNumber: 'ACC002', accountHolderName: 'John Doe', balance: 3000 }),
        createTestAccount({ id: 3, accountNumber: 'ACC003', accountHolderName: 'Jane Doe', balance: 10000 }),
        createTestAccount({ id: 4, accountNumber: 'ACC004', accountHolderName: 'Bob Smith', balance: 2000 }),
      ];
      bankAccountService.initializeAccounts(accounts);

      const result = service.getTopAccountHolders(2);

      expect(result).toHaveLength(2);
      expect(result[0].holderName).toBe('Jane Doe');
      expect(result[0].totalBalance).toBe(10000);
      expect(result[0].accountCount).toBe(1);
      expect(result[1].holderName).toBe('John Doe');
      expect(result[1].totalBalance).toBe(8000);
      expect(result[1].accountCount).toBe(2);
    });

    it('should throw error for invalid limit', () => {
      expect(() => service.getTopAccountHolders(0)).toThrow();
      expect(() => service.getTopAccountHolders(101)).toThrow();
    });

    it('should calculate average balance per holder', () => {
      const accounts = [
        createTestAccount({ id: 1, accountNumber: 'ACC001', accountHolderName: 'John Doe', balance: 4000 }),
        createTestAccount({ id: 2, accountNumber: 'ACC002', accountHolderName: 'John Doe', balance: 6000 }),
      ];
      bankAccountService.initializeAccounts(accounts);

      const result = service.getTopAccountHolders(1);

      expect(result[0].averageBalance).toBe(5000);
    });
  });

  describe('getSummary', () => {
    it('should return complete summary with timestamp', () => {
      const accounts = [
        createTestAccount({ id: 1, accountNumber: 'ACC001', accountHolderName: 'John Doe', balance: 1000 }),
      ];
      bankAccountService.initializeAccounts(accounts);

      const result = service.getSummary();

      expect(result.overview).toBeDefined();
      expect(result.distribution).toBeDefined();
      expect(result.topHolders).toBeDefined();
      expect(result.generatedAt).toBeDefined();
      expect(new Date(result.generatedAt)).toBeInstanceOf(Date);
    });
  });
});
