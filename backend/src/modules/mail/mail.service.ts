import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

type MailConfig = {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  from: string;
  frontendUrl: string;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly config: MailConfig;
  private readonly transporter: Transporter | null;

  constructor(private readonly configService: ConfigService) {
    this.config = this.buildConfig();
    this.transporter = this.buildTransporter();
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const resetUrl = `${this.config.frontendUrl}/resetar-senha?token=${encodeURIComponent(token)}`;

    if (!this.transporter) {
      this.logger.warn(
        `SMTP não configurado. Reset de senha para ${email}: ${resetUrl}`,
      );
      return;
    }

    await this.transporter.sendMail({
      from: this.config.from,
      to: email,
      subject: 'Redefinição de senha - Early Birds',
      text: `Use o link para redefinir sua senha: ${resetUrl}`,
      html: `<p>Use o link para redefinir sua senha:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });
  }

  private buildConfig(): MailConfig {
    return {
      host: this.configService.get<string>('MAIL_HOST'),
      port:
        Number(this.configService.get<string>('MAIL_PORT') ?? 0) || undefined,
      user: this.configService.get<string>('MAIL_USER'),
      pass: this.configService.get<string>('MAIL_PASS'),
      from:
        this.configService.get<string>('MAIL_FROM') ??
        'Early Birds <no-reply@earlybirds.local>',
      frontendUrl:
        this.configService.get<string>('FRONTEND_URL') ??
        'http://localhost:3000',
    };
  }

  private buildTransporter(): Transporter | null {
    if (
      !this.config.host ||
      !this.config.port ||
      !this.config.user ||
      !this.config.pass
    ) {
      return null;
    }

    return nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
    });
  }
}
