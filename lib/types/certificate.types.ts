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

export interface CreateCertificateDto {
  title: string;
  issuer: string;
  credentialUrl?: string;
  credentialId?: string;
  dateIssued: string;
  expirationDate?: string;
  doesNotExpire: boolean;
  displayOrder: number;
}

export interface UpdateCertificateDto {
  title?: string;
  issuer?: string;
  credentialUrl?: string;
  credentialId?: string;
  dateIssued?: string;
  expirationDate?: string;
  doesNotExpire?: boolean;
  displayOrder?: number;
}