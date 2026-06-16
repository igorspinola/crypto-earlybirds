import { Module } from '@nestjs/common';
import { CryptocurrenciesController } from './cryptocurrencies.controller';
import { CryptocurrenciesService } from './cryptocurrencies.service';

@Module({
  controllers: [CryptocurrenciesController],
  providers: [CryptocurrenciesService],
})
export class CryptocurrenciesModule {}
