import { Module } from '@nestjs/common';
import { MqService } from './mq.service';
import { ConfigService } from '@nestjs/config';

@Module({
  exports: [MqService],
  providers: [MqService, ConfigService],
})
export class MqModule {}
