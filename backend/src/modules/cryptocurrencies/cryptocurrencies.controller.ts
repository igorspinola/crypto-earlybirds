import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';
import { serializeCryptocurrency } from './cryptocurrency.serializer';
import { CryptocurrenciesService } from './cryptocurrencies.service';
import { CreateCryptocurrencyDto } from './dto/create-cryptocurrency.dto';
import { ListCryptocurrenciesDto } from './dto/list-cryptocurrencies.dto';
import { UpdateCryptocurrencyDto } from './dto/update-cryptocurrency.dto';

@ApiTags('cryptocurrencies')
@ApiBearerAuth()
@Controller('cryptocurrencies')
export class CryptocurrenciesController {
  constructor(
    private readonly cryptocurrenciesService: CryptocurrenciesService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() dto: CreateCryptocurrencyDto,
    @CurrentUser() authenticatedUser: AuthenticatedUser,
  ) {
    const cryptocurrency = await this.cryptocurrenciesService.create(
      dto,
      authenticatedUser.userId,
    );

    return serializeCryptocurrency(cryptocurrency);
  }

  @Get()
  async list(@Query() query: ListCryptocurrenciesDto) {
    const result = await this.cryptocurrenciesService.list(query);

    return {
      items: result.items.map(serializeCryptocurrency),
      meta: result.meta,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cryptocurrency =
      await this.cryptocurrenciesService.findByIdOrThrow(id);

    return serializeCryptocurrency(cryptocurrency);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateCryptocurrencyDto) {
    const cryptocurrency = await this.cryptocurrenciesService.update(id, dto);

    return serializeCryptocurrency(cryptocurrency);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.cryptocurrenciesService.delete(id);
  }
}
