export type ServiceName = 'ISM' | 'WOYAFAL';

export interface Facture {
  reference: string;
  walletCode: string;
  serviceName: ServiceName;
  montant: number;
  montantDu: number;
  mois: number;
  annee: number;
  dateEcheance: string;
  paid: boolean;
}

export interface PayDto {
  phoneNumber: string;
  serviceName: ServiceName;
  amount: number;
}

export interface PayFacturesDto {
  phoneNumber: string;
  serviceName: ServiceName;
  factureReferences: string[];
}
