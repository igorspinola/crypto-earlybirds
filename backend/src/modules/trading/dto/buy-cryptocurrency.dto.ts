import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class BuyCryptocurrencyDto {
  @ApiProperty({ example: 'crypto-id' })
  @IsString()
  cryptocurrencyId: string;

  @ApiProperty({ example: 0.5 })
  @IsNumber()
  @Min(0.00000001)
  quantity: number;
}
