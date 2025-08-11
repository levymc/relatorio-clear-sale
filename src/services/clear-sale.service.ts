import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { ClearSaleAuthResponse, CreditScoreData } from '../interfaces/clear-sale.interfaces';

@Injectable()
export class ClearSaleService {
  private readonly creditRiskBaseUrl: string;
  private readonly creditRiskUser: string;
  private readonly creditRiskPass: string;
  private readonly creditRiskCriterion: number;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.creditRiskBaseUrl = this.configService.get<string>('URL_CREDIT_PRO') ?? '';
    this.creditRiskUser = this.configService.get<string>('CREDIT_PRO_USER') ?? '';
    this.creditRiskPass = this.configService.get<string>('CREDIT_PRO_PASS') ?? '';
    this.creditRiskCriterion = this.configService.get<number>('CREDIT_PRO_CRITERION') ?? 15;
  }

  private cleanCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  async getCreditRiskAuthToken(): Promise<ClearSaleAuthResponse> {
    try {
      const response = await lastValueFrom(
        this.http.post<ClearSaleAuthResponse>(
          `${this.creditRiskBaseUrl}/authentication`,
          {
            Username: this.creditRiskUser,
            Password: this.creditRiskPass,
          },
        )
      );
      return response.data;
    } catch (err: any) {
      console.error('Falha na autenticação Clear Sale:', err.message);
      throw new HttpException(
        'Falha na autenticação Clear Sale',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private convertApiResponseToCreditData(apiData: any): CreditScoreData {
    const findScore = (name: string) => {
      const score = apiData.scores?.find((s: any) => s.name === name);
      return score?.value || null;
    };

    return {
      id: apiData.id || 'N/A',
      document: apiData.document || null,
      scoreV3: findScore('Score v3'),
      personaBancarizada: findScore('Persona Bancarizada'),
      personaPresencaDigital: findScore('Persona Presenca Digital'),
      personaBanco: findScore('Persona Banco'),
      personaCategoriaCartao: findScore('Persona Categoria cartao'),
      flagVAVR: findScore('Flag VA/VR'),
      consumoGeral: findScore('Potencial de consumo - Geral'),
      magazine: findScore('Potencial de consumo - Magazine'),
      delivery: findScore('Potencial de consumo - Delivery'),
      vestuario: findScore('Potencial de consumo - Vestuario e acessorios'),
      esportes: findScore('Potencial de consumo - Lojas esportivas'),
      farmacia: findScore('Potencial de consumo - Farmacia e suplementos'),
      casa: findScore('Potencial de consumo - Casa'),
      cosmeticos: findScore('Potencial de consumo - Cosmeticos e Perfumaria'),
      eletronicos: findScore('Potencial de consumo - Eletronicos e papelaria'),
      mercados: findScore('Potencial de consumo - Mercados'),
      pets: findScore('Potencial de consumo - Lojas de pets'),
      lazer: findScore('Potencial de consumo - Lazer e entretenimento'),
    };
  }

  async fetchCpfCreditData(token: string, cpf: string): Promise<CreditScoreData> {
    const cleanedCpf = this.cleanCpf(cpf);
    
    try {
      const url = `${this.creditRiskBaseUrl}/creditpro/transaction`;
      
      const response = await lastValueFrom(
        this.http.post<any>(
          url, 
          { 
            document: cleanedCpf, 
            criterion: this.creditRiskCriterion 
          }, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        )
      );

      return this.convertApiResponseToCreditData(response.data);
    } catch (err: any) {
      console.error(`Erro ao consultar CPF ${cleanedCpf}:`, err?.response?.data || err.message);
      throw new HttpException(
        `Erro ao buscar dados para CPF ${cleanedCpf}`,
        err?.response?.status || HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async fetchMultipleCpfsData(cpfs: string[]): Promise<CreditScoreData[]> {
    const token = await this.getCreditRiskAuthToken();
    const results: CreditScoreData[] = [];
    
    console.log(`Iniciando processamento de ${cpfs.length} CPFs...`);
    
    // Processar em lotes de 10 CPFs simultaneamente para não sobrecarregar a API
    const batchSize = 10;
    const batches = this.chunkArray(cpfs, batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchNumber = i + 1;
      const totalBatches = batches.length;
      
      console.log(`Processando lote ${batchNumber}/${totalBatches} (${batch.length} CPFs)`);
      
      // Processar CPFs do lote em paralelo
      const batchPromises = batch.map(cpf => 
        this.processCpfWithRetry(token.token, cpf, 3)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      // Coletar resultados bem-sucedidos
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          results.push(result.value);
        } else if (result.status === 'rejected') {
          console.error(`Erro ao processar CPF ${batch[index]}:`, result.reason);
        }
      });
      
      // Pequena pausa entre lotes para não saturar a API
      if (i < batches.length - 1) {
        await this.sleep(500); // 500ms entre lotes
      }
    }
    
    console.log(`Processamento concluído: ${results.length}/${cpfs.length} CPFs com dados válidos`);
    return results;
  }

  private async processCpfWithRetry(token: string, cpf: string, maxRetries: number): Promise<CreditScoreData | null> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.fetchCpfCreditData(token, cpf);
      } catch (error) {
        console.error(`Tentativa ${attempt}/${maxRetries} falhou para CPF ${cpf}:`, error);
        
        if (attempt < maxRetries) {
          // Esperar antes de tentar novamente (backoff exponencial)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await this.sleep(delay);
        }
      }
    }
    return null;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}