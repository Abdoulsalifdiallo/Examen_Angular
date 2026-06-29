export interface Wallet {
  id: number;
  code: string;
  phoneNumber: string;
  email: string;
  balance: number;
  currency: string;
  createdAt: string;
}

export interface WalletPage {
  content: Wallet[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateWalletDto {
  phoneNumber: string;
  email: string;
  initialBalance?: number;
}

export type PaymentMethod = 'CREDIT_CARD' | 'WALLET_TARGET';

export interface DepositDto {
  amount: number;
  paymentMethod: PaymentMethod;
}

export interface WithdrawDto {
  phoneNumber: string;
  amount: number;
}

export interface BalanceResponse {
  phoneNumber: string;
  balance: number;
  currency: string;
}
