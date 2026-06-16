import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTraderDto {
  @ApiProperty({ example: 'Ada Lovelace' })
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty({ example: 'ada@earlybirds.local' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6, example: 'trader123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 28 })
  @IsOptional()
  @IsInt()
  @Min(1)
  age?: number;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/ada.png' })
  @IsOptional()
  @IsUrl({ require_tld: false })
  photoUrl?: string;
}
