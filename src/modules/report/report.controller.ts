import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
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
  async generateReport(@Body() generateReportDto: GenerateReportDto): Promise<ReportResponse> {
    try {
      if (!generateReportDto.cpfs || generateReportDto.cpfs.length === 0) {
        throw new HttpException('Lista de CPFs é obrigatória', HttpStatus.BAD_REQUEST);
      }

      console.log(`Iniciando processamento de ${generateReportDto.cpfs.length} CPFs`);

      const creditData = await this.clearSaleService.fetchMultipleCpfsData(generateReportDto.cpfs);
      
      if (creditData.length === 0) {
        throw new HttpException('Nenhum dado foi encontrado para os CPFs fornecidos', HttpStatus.NOT_FOUND);
      }

      const reportResponse = await this.reportService.generateReport(creditData);

      console.log(`Relatório gerado: ${reportResponse.filename}`);

      return reportResponse;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Erro ao gerar relatório:', error);
      throw new HttpException(
        'Erro interno do servidor ao gerar relatório',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}