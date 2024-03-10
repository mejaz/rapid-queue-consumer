import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MqModule } from './modules/mq/mq.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MqModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
