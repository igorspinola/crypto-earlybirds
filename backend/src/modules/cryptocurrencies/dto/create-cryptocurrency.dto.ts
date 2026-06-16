import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCryptocurrencyDto {
  @ApiProperty({ example: 'Solana' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'SOL' })
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  @Matches(/^[A-Za-z0-9]+$/)
  symbol: string;

  @ApiProperty({ example: 'Blockchain de alta performance.' })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({ example: 'https://cdn.example.com/solana.png' })
  @IsUrl({ require_tld: false })
  imageUrl: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0.00000001)
  initialPrice: number;

  @ApiProperty({ example: 200 })
  @IsNumber()
  @Min(0.00000001)
  quantity: number;

  @ApiProperty({ example: 'defi' })
  @IsString()
  @MinLength(1)
  categoryUid: string;
}
