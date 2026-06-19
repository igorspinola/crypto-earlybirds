import { Module } from '@nestjs/common';
import { AsaasClient } from './asaas.client';
import { DepositsController } from './deposits.controller';
import { DepositsService } from './deposits.service';

@Module({
  controllers: [DepositsController],
  providers: [AsaasClient, DepositsService],
})
export class DepositsModule {}
