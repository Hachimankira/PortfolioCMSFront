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

// Use utility types
export type CreateEducationDto = Omit<Education, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEducationDto = Partial<Omit<Education, 'id' | 'createdAt' | 'updatedAt'>>;