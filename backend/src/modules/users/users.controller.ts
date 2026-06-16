import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/types/authenticated-user';
import { CreateTraderDto } from './dto/create-trader.dto';
import { serializeUser } from './user.serializer';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@CurrentUser() authenticatedUser: AuthenticatedUser) {
    const user = await this.usersService.findByIdOrThrow(
      authenticatedUser.userId,
    );
    return serializeUser(user);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createTrader(@Body() dto: CreateTraderDto) {
    const user = await this.usersService.createTrader(dto);
    return serializeUser(user);
  }
}
