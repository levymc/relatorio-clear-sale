import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportModule } from './modules/report/report.module';
import { DocsModule } from './modules/docs/docs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ReportModule,
    DocsModule,
  ],
})
export class AppModule {}