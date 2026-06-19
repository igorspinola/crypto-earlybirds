import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

class AsaasWebhookPaymentDto {
  @ApiProperty({ example: 'pay_123' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'CONFIRMED' })
  @IsString()
  status: string;
}

export class AsaasWebhookDto {
  @ApiProperty({ example: 'PAYMENT_CONFIRMED' })
  @IsString()
  event: string;

  @ApiProperty({ type: AsaasWebhookPaymentDto })
  @ValidateNested()
  @Type(() => AsaasWebhookPaymentDto)
  payment: AsaasWebhookPaymentDto;
}
