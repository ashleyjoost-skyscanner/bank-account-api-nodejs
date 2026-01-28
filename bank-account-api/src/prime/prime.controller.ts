import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { PrimeService } from './prime.service';

@Controller('api/prime')
export class PrimeController {
  constructor(private readonly primeService: PrimeService) {}

  @Get(':number')
  isPrime(@Param('number') number: string): boolean {
    const parsedNumber = parseInt(number, 10);
    if (isNaN(parsedNumber)) {
      throw new BadRequestException('Invalid number provided');
    }
    if (parsedNumber < 0) {
      throw new BadRequestException('Number must be non-negative');
    }
    if (parsedNumber > 1000000000) {
      throw new BadRequestException('Number too large. Maximum allowed is 1,000,000,000');
    }
    return this.primeService.isPrime(parsedNumber);
  }
}
