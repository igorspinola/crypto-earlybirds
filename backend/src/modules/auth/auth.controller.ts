import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { AuthenticatedUser } from './types/authenticated-user';
import { CreateTraderDto } from '../users/dto/create-trader.dto';
import { UsersService } from '../users/users.service';
import { serializeUser } from '../users/user.serializer';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(dto);
    this.setAuthCookie(response, result.accessToken);

    return {
      user: result.user,
    };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: CreateTraderDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(dto);
    this.setAuthCookie(response, result.accessToken);

    return {
      user: result.user,
    };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) response: Response): void {
    const { httpOnly, path, sameSite, secure } = this.getCookieOptions();
    response.clearCookie('access_token', { httpOnly, path, sameSite, secure });
  }

  @ApiBearerAuth()
  @Get('me')
  async me(@CurrentUser() authenticatedUser: AuthenticatedUser) {
    const user = await this.usersService.findByIdOrThrow(
      authenticatedUser.userId,
    );
    return serializeUser(user);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.authService.requestPasswordReset(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto.token, dto.password);
  }

  private setAuthCookie(response: Response, accessToken: string): void {
    response.cookie('access_token', accessToken, {
      ...this.getCookieOptions(),
      maxAge: this.authService.getJwtCookieMaxAge(),
    });
  }

  private getCookieOptions() {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      path: '/',
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      secure: isProduction,
    };
  }
}
