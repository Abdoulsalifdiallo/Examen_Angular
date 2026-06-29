export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'PAYMENT';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  fee: number;
  paymentMethod: string | null;
  counterparty: string | null;
  timestamp: string;
}

export interface TransferDto {
  senderPhone: string;
  receiverPhone: string;
  amount: number;
}
