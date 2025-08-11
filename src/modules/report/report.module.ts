import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ReportController } from './report.controller';
import { ClearSaleService } from '../../services/clear-sale.service';
import { ReportService } from '../../services/report.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  controllers: [ReportController],
  providers: [ClearSaleService, ReportService],
})
export class ReportModule {}