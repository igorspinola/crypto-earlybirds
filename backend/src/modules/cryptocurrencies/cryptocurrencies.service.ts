import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCryptocurrencyDto } from './dto/create-cryptocurrency.dto';
import { ListCryptocurrenciesDto } from './dto/list-cryptocurrencies.dto';
import { UpdateCryptocurrencyDto } from './dto/update-cryptocurrency.dto';

type PaginatedCryptocurrencies = {
  items: Awaited<ReturnType<PrismaService['cryptocurrency']['findMany']>>;
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

@Injectable()
export class CryptocurrenciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCryptocurrencyDto, adminUserId: string) {
    const symbol = this.normalizeSymbol(dto.symbol);
    await this.ensureSymbolIsAvailable(symbol);

    return this.prisma.cryptocurrency.create({
      data: {
        name: dto.name,
        symbol,
        description: dto.description,
        imageUrl: dto.imageUrl,
        initialPrice: dto.initialPrice,
        currentPrice: dto.initialPrice,
        totalSupply: dto.quantity,
        availableSupply: dto.quantity,
        categoryUid: dto.categoryUid,
        createdById: adminUserId,
      },
    });
  }

  async list(
    query: ListCryptocurrenciesDto,
  ): Promise<PaginatedCryptocurrencies> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 24;
    const where = this.buildWhereInput(query);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.cryptocurrency.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.cryptocurrency.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findByIdOrThrow(id: string) {
    const cryptocurrency = await this.prisma.cryptocurrency.findUnique({
      where: { id },
    });

    if (cryptocurrency) return cryptocurrency;

    throw new NotFoundException('Criptomoeda não encontrada');
  }

  async update(id: string, dto: UpdateCryptocurrencyDto) {
    await this.findByIdOrThrow(id);

    if (dto.symbol) {
      const symbol = this.normalizeSymbol(dto.symbol);
      await this.ensureSymbolIsAvailable(symbol, id);
    }

    return this.prisma.cryptocurrency.update({
      where: { id },
      data: this.buildUpdateInput(dto),
    });
  }

  async delete(id: string): Promise<void> {
    await this.findByIdOrThrow(id);
    await this.ensureCanDelete(id);

    await this.prisma.cryptocurrency.delete({
      where: { id },
    });
  }

  private buildWhereInput(
    query: ListCryptocurrenciesDto,
  ): Prisma.CryptocurrencyWhereInput {
    const filters: Prisma.CryptocurrencyWhereInput[] = [];

    if (query.categoryUid) {
      filters.push({ categoryUid: query.categoryUid });
    }

    if (query.search) {
      filters.push({
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { symbol: { contains: query.search, mode: 'insensitive' } },
        ],
      });
    }

    if (filters.length === 0) return {};

    return { AND: filters };
  }

  private buildUpdateInput(
    dto: UpdateCryptocurrencyDto,
  ): Prisma.CryptocurrencyUpdateInput {
    const data: Prisma.CryptocurrencyUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.categoryUid !== undefined) data.categoryUid = dto.categoryUid;
    if (dto.symbol !== undefined)
      data.symbol = this.normalizeSymbol(dto.symbol);

    if (dto.initialPrice !== undefined) {
      data.initialPrice = dto.initialPrice;
      data.currentPrice = dto.initialPrice;
    }

    if (dto.quantity !== undefined) {
      data.totalSupply = dto.quantity;
      data.availableSupply = dto.quantity;
    }

    return data;
  }

  private async ensureSymbolIsAvailable(
    symbol: string,
    ignoredId?: string,
  ): Promise<void> {
    const existingCryptocurrency = await this.prisma.cryptocurrency.findUnique({
      where: { symbol },
    });

    if (!existingCryptocurrency) return;
    if (existingCryptocurrency.id === ignoredId) return;

    throw new ConflictException('Símbolo já cadastrado');
  }

  private async ensureCanDelete(id: string): Promise<void> {
    const [holdingsCount, transactionsCount] = await this.prisma.$transaction([
      this.prisma.walletHolding.count({ where: { cryptocurrencyId: id } }),
      this.prisma.transaction.count({ where: { cryptocurrencyId: id } }),
    ]);

    if (holdingsCount === 0 && transactionsCount === 0) return;

    throw new ConflictException(
      'Criptomoeda já possui movimentações e não pode ser removida',
    );
  }

  private normalizeSymbol(symbol: string): string {
    return symbol.trim().toUpperCase();
  }
}
