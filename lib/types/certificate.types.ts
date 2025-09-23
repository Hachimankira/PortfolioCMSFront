export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  credentialUrl?: string;
  credentialId?: string;
  dateIssued: string;
  expirationDate?: string;
  doesNotExpire: boolean;
  displayOrder: number;
}

// Use utility types to avoid repetition
export type CreateCertificateDto = Omit<Certificate, 'id'>;
export type UpdateCertificateDto = Partial<Omit<Certificate, 'id'>>;