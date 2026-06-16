import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListCryptocurrenciesDto {
  @ApiPropertyOptional({ example: 'sol' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'defi' })
  @IsOptional()
  @IsString()
  categoryUid?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 24, default: 24, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 24;
}
