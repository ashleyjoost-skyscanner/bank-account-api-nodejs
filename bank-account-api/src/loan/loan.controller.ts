import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { LoanService, CreateLoanDto, MakePaymentDto } from './loan.service';
import { Loan, LoanPayment } from './loan.model';
import { LoanConfiguration } from './loan.config';

@Controller('api/Loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  // Configuration endpoints
  @Get('config')
  getConfiguration(): LoanConfiguration {
    return this.loanService.getConfiguration();
  }

  @Put('config')
  updateConfiguration(@Body() updates: Partial<LoanConfiguration>): LoanConfiguration {
    return this.loanService.updateConfiguration(updates);
  }

  // Portfolio statistics
  @Get('stats')
  getPortfolioStats() {
    return this.loanService.getPortfolioStats();
  }

  // Loan CRUD endpoints
  @Get()
  getAllLoans(): Loan[] {
    return this.loanService.getAllLoans();
  }

  @Get('active')
  getActiveLoans(): Loan[] {
    return this.loanService.getActiveLoans();
  }

  @Get('search')
  searchByAccountHolder(@Query('name') name: string): Loan[] {
    if (!name) {
      throw new BadRequestException('Name parameter is required');
    }
    return this.loanService.getLoansByAccountHolder(name);
  }

  @Get(':id')
  getLoanById(@Param('id') id: string): Loan {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid loan ID');
    }
    return this.loanService.getLoanById(numericId);
  }

  @Get(':id/summary')
  getLoanSummary(@Param('id') id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid loan ID');
    }
    return this.loanService.getLoanSummary(numericId);
  }

  @Get(':id/payments')
  getPaymentHistory(@Param('id') id: string): LoanPayment[] {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid loan ID');
    }
    return this.loanService.getPaymentHistory(numericId);
  }

  @Post()
  createLoan(@Body() dto: CreateLoanDto): Loan {
    if (!dto.accountHolderName) {
      throw new BadRequestException('Account holder name is required');
    }
    if (!dto.principalAmount) {
      throw new BadRequestException('Principal amount is required');
    }
    if (!dto.termMonths) {
      throw new BadRequestException('Term (months) is required');
    }
    return this.loanService.createLoan(dto);
  }

  @Post(':id/payment')
  makePayment(@Param('id') id: string, @Body() dto: MakePaymentDto): LoanPayment {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid loan ID');
    }
    return this.loanService.makePayment(numericId, dto);
  }
}
