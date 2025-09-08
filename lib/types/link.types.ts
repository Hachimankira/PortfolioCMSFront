export interface Link {
  id: number;
  platform: string;
  url: string;
  iconUrl?: string;
  displayOrder: number;
  userId: string;
}

export interface CreateLinkDto {
  platform: string;
  url: string;
  iconUrl?: string;
  displayOrder: number;
}

export interface UpdateLinkDto {
  id: number;
  platform: string;
  url: string;
  iconUrl?: string;
  displayOrder: number;
}