export interface Link {
  id: number;
  platform: string;
  url: string;
  iconUrl?: string;
  displayOrder: number;
  userId: string;
}

// Use utility types
export type CreateLinkDto = Omit<Link, 'id' | 'userId'>;
export type UpdateLinkDto = Partial<Omit<Link, 'id' | 'userId'>>;