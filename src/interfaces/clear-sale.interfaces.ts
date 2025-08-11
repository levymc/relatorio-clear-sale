export interface ClearSaleAuthResponse {
  token: string;
  expires: string;
}

export interface CreditScoreData {
  id: string;
  document: string;
  scoreV3: string;
  personaBancarizada: string;
  personaPresencaDigital: string;
  personaBanco: string;
  personaCategoriaCartao: string;
  flagVAVR: string;
  consumoGeral: string;
  magazine: string | null;
  delivery: string | null;
  vestuario: string | null;
  esportes: string | null;
  farmacia: string | null;
  casa: string | null;
  cosmeticos: string | null;
  eletronicos: string | null;
  mercados: string | null;
  pets: string | null;
  lazer: string | null;
}

export interface ReportResponse {
  html: string;
  filename: string;
  jsonFilename: string;
  cpfsProcessed: number;
  cpfsWithData: number;
}