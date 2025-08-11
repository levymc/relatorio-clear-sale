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
      id: apiData.id,
      document: apiData.document,
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

    for (const cpf of cpfs) {
      try {
        const data = await this.fetchCpfCreditData(token.token, cpf);
        results.push(data);
      } catch (error) {
        console.error(`Erro ao processar CPF ${cpf}:`, error);
      }
    }

    return results;
  }
}