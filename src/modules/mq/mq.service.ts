import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

@Injectable()
export class MqService implements OnModuleInit {
  private connection: AmqpConnectionManager;
  private emailChannel: ChannelWrapper;
  private readonly emailQueue: string;
  private readonly mqServerUrl: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.mqServerUrl = this.configService.get<string>('MESSAGE_QUEUE_URL');
    this.emailQueue = this.configService.get('MESSAGE_QUEUE_EMAIL');
  }

  async onModuleInit() {
    await this.connect();
  }

  private async connect() {
    try {
      this.connection = amqp.connect([this.mqServerUrl]);

      this.emailChannel = this.connection.createChannel({
        setup: (channel: ConfirmChannel) => {
          return this.consumeEmailMessages(channel);
        },
      });

      console.log('*** CONNECTED TO RABBITMQ SERVER ***');

    } catch (err) {
      console.error('Error connecting to RabbitMQ server: ', err);
    }
  }

  private async consumeEmailMessages(channel: ConfirmChannel) {
    try {
      await channel.prefetch(5);
      await channel.consume(this.emailQueue, (message) => this.handleEmailMessages(channel, message));

    } catch (err) {
      console.error('Error consuming email queue messages: ', err);
    }
  }

  private delay = ms => new Promise(res => setTimeout(res, ms));

  private async handleEmailMessages(channel: ConfirmChannel, data: any) {
    try {
      // mocking a delay for sending email
      await this.delay(3000);  // 3 seconds
      console.log(data.content.toString());
      console.log('-- email sent successfully --');
      channel.ack(data);
    } catch (e) {
      channel.nack(data);
    }
  }
}
