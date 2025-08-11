import { Controller, Post, Body, HttpStatus, HttpException, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenerateReportDto } from '../../dto/generate-report.dto';
import { ClearSaleService } from '../../services/clear-sale.service';
import { ReportService } from '../../services/report.service';
import { ReportResponse } from '../../interfaces/clear-sale.interfaces';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(
    private readonly clearSaleService: ClearSaleService,
    private readonly reportService: ReportService,
  ) {}

  @Post('generate')
  @ApiOperation({ 
    summary: 'Gera relatório HTML para lista de CPFs',
    description: 'Recebe uma lista de CPFs, consulta os dados no Clear Sale e gera um relatório HTML'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Relatório gerado com sucesso',
    schema: {
      type: 'object',
      properties: {
        html: { type: 'string', description: 'HTML do relatório gerado' },
        filename: { type: 'string', description: 'Nome do arquivo salvo' },
        cpfsProcessed: { type: 'number', description: 'Número de CPFs processados' },
        cpfsWithData: { type: 'number', description: 'Número de CPFs com dados válidos' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos' 
  })
  @ApiResponse({ 
    status: 502, 
    description: 'Erro na integração com Clear Sale' 
  })
  async generateReport(
    @Body() generateReportDto: GenerateReportDto,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const startTime = Date.now();
    
    try {
      if (!generateReportDto.cpfs || generateReportDto.cpfs.length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          error: 'Lista de CPFs é obrigatória' 
        });
        return;
      }

      const cpfCount = generateReportDto.cpfs.length;
      const estimatedTime = Math.ceil(cpfCount / 10) * 5; // Estimativa: 5 segundos por lote de 10

      console.log(`🚀 Iniciando processamento de ${cpfCount} CPFs (tempo estimado: ~${estimatedTime}s)`);

      // Configurar timeout dinâmico baseado na quantidade de CPFs
      const timeoutMs = Math.max(300000, cpfCount * 5000); // Mínimo 5min, ou 5s por CPF
      req.setTimeout(timeoutMs);
      res.setTimeout(timeoutMs);

      console.log(`⏱️ Timeout configurado para ${Math.round(timeoutMs/1000)}s`);

      // Processar CPFs
      const creditData = await this.clearSaleService.fetchMultipleCpfsData(generateReportDto.cpfs);
      
      if (creditData.length === 0) {
        res.status(HttpStatus.NOT_FOUND).json({ 
          error: 'Nenhum dado foi encontrado para os CPFs fornecidos',
          cpfsProcessed: cpfCount,
          cpfsWithData: 0
        });
        return;
      }

      // Gerar relatório
      const reportResponse = await this.reportService.generateReport(creditData);

      const processingTime = Math.round((Date.now() - startTime) / 1000);
      const successRate = Math.round((creditData.length / cpfCount) * 100);

      console.log(`✅ Relatório concluído em ${processingTime}s: ${reportResponse.filename}`);
      console.log(`📊 Taxa de sucesso: ${successRate}% (${creditData.length}/${cpfCount} CPFs)`);

      // Adicionar estatísticas extras na resposta
      const enhancedResponse = {
        ...reportResponse,
        processingTime,
        successRate,
        cpfsRequested: cpfCount,
        timestamp: new Date().toISOString()
      };

      res.status(HttpStatus.OK).json(enhancedResponse);

    } catch (error) {
      const processingTime = Math.round((Date.now() - startTime) / 1000);
      
      if (error instanceof HttpException) {
        res.status(error.getStatus()).json({ 
          error: error.message,
          processingTime 
        });
        return;
      }

      console.error('❌ Erro ao gerar relatório:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        error: 'Erro interno do servidor ao gerar relatório',
        processingTime,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}