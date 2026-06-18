import nodemailer from 'nodemailer';
import { MailService } from './mail.service';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

const configService = {
  get: jest.fn(),
};

describe('MailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('skips email sending when smtp is not configured', async () => {
    configService.get.mockReturnValue(undefined);
    const service = new MailService(configService as never);

    await service.sendPasswordReset('user@email.com', 'token');

    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });

  it('sends password reset email when smtp is configured', async () => {
    const sendMail = jest.fn().mockResolvedValue(undefined);
    jest.mocked(nodemailer.createTransport).mockReturnValue({
      sendMail,
    } as never);
    configService.get.mockImplementation((key: string) => {
      const values: Record<string, string> = {
        MAIL_HOST: 'smtp.example.com',
        MAIL_PORT: '2525',
        MAIL_USER: 'user',
        MAIL_PASS: 'pass',
        MAIL_FROM: 'Early Birds <no-reply@example.com>',
        FRONTEND_URL: 'http://localhost:3000',
      };

      return values[key];
    });

    const service = new MailService(configService as never);
    await service.sendPasswordReset('user@email.com', 'reset token');

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: 'smtp.example.com',
      port: 2525,
      auth: {
        user: 'user',
        pass: 'pass',
      },
    });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@email.com',
        text: expect.stringContaining('reset%20token'),
      }),
    );
  });
});
