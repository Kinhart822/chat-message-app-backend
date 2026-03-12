import { IMailType, MAIL_TITLE } from '@constants/mail.constant';
import { MAIL_QUEUE } from '@constants/queue.constant';
import {
  getRedisMailTypeOtp,
  MAIL_ACTION_TTL,
} from '@constants/redis.constant';
import { RedisService } from '@modules/redis/redis.service';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import dayjs from 'dayjs';
import { Transactional } from 'typeorm-transactional';
import { generateOTP } from 'utils/code';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @InjectQueue(MAIL_QUEUE) private readonly emailQueue: Queue,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Add email job to queue
   */
  async sendEmailToQueue(email: string, token: string, type: IMailType) {
    const jobId = `${email}-${type}-${Date.now()}`;
    return await this.emailQueue.add(
      MAIL_QUEUE,
      { email, token, type },
      {
        attempts: 3,
        backoff: { type: 'fixed', delay: 2000 },
        removeOnComplete: true,
        jobId,
      },
    );
  }

  /**
   * OTP Logic
   */
  private async handleGenerateAndSaveOTP(
    email: string,
    type: IMailType,
  ): Promise<string> {
    const code = generateOTP();
    const redisKey = getRedisMailTypeOtp(email, type);

    await this.redisService.set(redisKey, code, MAIL_ACTION_TTL);
    return code;
  }

  @Transactional()
  async generateAndSendOTP(email: string, type: IMailType) {
    const code = await this.handleGenerateAndSaveOTP(email, type);

    // Push to Queue for background sending
    await this.sendEmailToQueue(email, code, type);

    return {
      email,
      type,
      expiredAt: dayjs().add(MAIL_ACTION_TTL, 'millisecond').toDate(),
    };
  }

  /**
   * Verify OTP from Redis
   */
  async verifyOTP(
    email: string,
    code: string,
    type: IMailType,
  ): Promise<boolean> {
    const redisKey = getRedisMailTypeOtp(email, type);
    const storedCode = await this.redisService.get<string>(redisKey);

    if (!storedCode || storedCode !== code) {
      return false;
    }

    // Delete code after successful verification
    await this.redisService.del(redisKey);
    return true;
  }

  /**
   *  Mail Sending Methods
   */
  async sendSignUpEmail(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: MAIL_TITLE.TC01,
      template: 'sign_up',
      context: { email, code: token },
    });
  }

  async sendResendCodeEmail(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: MAIL_TITLE.TC02,
      template: 'resend_code',
      context: { email, code: token },
    });
  }

  async sendForgotPasswordEmail(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: MAIL_TITLE.TC03,
      template: 'forgot_password',
      context: { email, code: token },
    });
  }

  async sendHTMLEmail(to: string, subject: string, html: string) {
    try {
      await this.mailerService.sendMail({ to, subject, html });
    } catch (error) {
      this.logger.error(`Failed to send HTML email to ${to}`, error);
    }
  }
}
