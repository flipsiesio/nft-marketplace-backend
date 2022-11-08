import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { Agent } from 'https';
import { RequestService } from './request.service';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
      httpsAgent: new Agent({
        rejectUnauthorized: false,
      }),
      transformResponse: [
        function (data) {
          return data;
        },
      ],
    }),
  ],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
