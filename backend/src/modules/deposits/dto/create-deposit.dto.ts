import { ApiProperty } from '@nestjs/swagger';
import { DepositMethod } from '@prisma/client';
import { IsEnum, IsNumber, Min } from 'class-validator';

export class CreateDepositDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  amountBRL: number;

  @ApiProperty({ enum: DepositMethod, example: DepositMethod.PIX })
  @IsEnum(DepositMethod)
  method: DepositMethod;
}
