export type Role = 'client' | 'agent';

export interface Session {
  role: Role;
  phone: string;
  fullName: string;
  walletId?: number;
  walletCode?: string;
}
