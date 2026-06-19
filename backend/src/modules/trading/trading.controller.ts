import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';
import { BuyCryptocurrencyDto } from './dto/buy-cryptocurrency.dto';
import { SellCryptocurrencyDto } from './dto/sell-cryptocurrency.dto';
import { TradingService } from './trading.service';

@ApiTags('trading')
@ApiBearerAuth()
@Controller('trading')
export class TradingController {
  constructor(private readonly tradingService: TradingService) {}

  @Post('buy')
  async buy(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
    @Body() dto: BuyCryptocurrencyDto,
  ) {
    return this.tradingService.buy(authenticatedUser.userId, dto);
  }

  @Post('sell')
  async sell(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
    @Body() dto: SellCryptocurrencyDto,
  ) {
    return this.tradingService.sell(authenticatedUser.userId, dto);
  }

  @Get('transactions')
  async listTransactions(@CurrentUser() authenticatedUser: AuthenticatedUser) {
    return this.tradingService.listTransactions(authenticatedUser.userId);
  }
}
