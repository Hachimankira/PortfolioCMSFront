export interface Education {
  id: number;
  institution: string;
  degree: string;
  description?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  institutionLogoUrl?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEducationDto {
  institution: string;
  degree: string;
  description?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  institutionLogoUrl?: string;
  displayOrder: number;
}

export interface UpdateEducationDto {
  institution?: string;
  degree?: string;
  description?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  institutionLogoUrl?: string;
  displayOrder?: number;
}