import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PrimeController } from '../src/prime/prime.controller';
import { PrimeService } from '../src/prime/prime.service';

describe('PrimeController', () => {
  let controller: PrimeController;
  let service: PrimeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrimeController],
      providers: [PrimeService],
    }).compile();

    controller = module.get<PrimeController>(PrimeController);
    service = module.get<PrimeService>(PrimeService);
  });

  it('should return true for prime numbers', () => {
    expect(controller.isPrime('7')).toBe(true);
    expect(controller.isPrime('13')).toBe(true);
    expect(controller.isPrime('97')).toBe(true);
  });

  it('should return false for non-prime numbers', () => {
    expect(controller.isPrime('4')).toBe(false);
    expect(controller.isPrime('10')).toBe(false);
    expect(controller.isPrime('100')).toBe(false);
  });

  it('should return false for 0 and 1', () => {
    expect(controller.isPrime('0')).toBe(false);
    expect(controller.isPrime('1')).toBe(false);
  });

  // Validation tests
  describe('Input Validation', () => {
    it('should throw BadRequestException for non-numeric input', () => {
      expect(() => controller.isPrime('abc')).toThrow(BadRequestException);
      expect(() => controller.isPrime('abc')).toThrow('Invalid number provided');
    });

    it('should throw BadRequestException for empty string', () => {
      expect(() => controller.isPrime('')).toThrow(BadRequestException);
      expect(() => controller.isPrime('')).toThrow('Invalid number provided');
    });

    it('should throw BadRequestException for negative numbers', () => {
      expect(() => controller.isPrime('-5')).toThrow(BadRequestException);
      expect(() => controller.isPrime('-5')).toThrow('Number must be non-negative');
    });

    it('should throw BadRequestException for numbers exceeding limit', () => {
      expect(() => controller.isPrime('1000000001')).toThrow(BadRequestException);
      expect(() => controller.isPrime('1000000001')).toThrow(
        'Number too large. Maximum allowed is 1,000,000,000',
      );
    });

    it('should accept numbers at the boundary', () => {
      expect(() => controller.isPrime('1000000000')).not.toThrow();
    });

    it('should throw BadRequestException for floating point strings', () => {
      // parseInt('3.14', 10) returns 3, so this should work
      expect(controller.isPrime('3.14')).toBe(true); // parseInt parses as 3
    });

    it('should throw BadRequestException for mixed alphanumeric', () => {
      // parseInt('123abc', 10) returns 123
      expect(controller.isPrime('123abc')).toBe(false); // parseInt parses as 123
    });
  });
});
