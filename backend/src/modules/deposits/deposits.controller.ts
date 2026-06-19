import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';
import { DepositsService } from './deposits.service';
import { AsaasWebhookDto } from './dto/asaas-webhook.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';

@ApiTags('deposits')
@ApiBearerAuth()
@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  async create(
    @CurrentUser() authenticatedUser: AuthenticatedUser,
    @Body() dto: CreateDepositDto,
  ) {
    return this.depositsService.create(authenticatedUser.userId, dto);
  }

  @Get()
  async list(@CurrentUser() authenticatedUser: AuthenticatedUser) {
    return this.depositsService.list(authenticatedUser.userId);
  }

  @Post(':id/confirm')
  @Roles(UserRole.ADMIN)
  async confirm(@Param('id') id: string) {
    return this.depositsService.confirm(id);
  }

  @Public()
  @Post('webhook/asaas')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader({ name: 'asaas-access-token', required: false })
  async asaasWebhook(
    @Body() dto: AsaasWebhookDto,
    @Headers('asaas-access-token') accessToken?: string,
  ): Promise<void> {
    await this.depositsService.handleWebhook(dto, accessToken);
  }
}
