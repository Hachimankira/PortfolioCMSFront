export enum EmploymentType {
  FullTime = 0,
  PartTime = 1,
  Contract = 2,
  Internship = 3,
  Freelance = 4
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  location: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  companyLogoUrl: string;
  displayOrder: number;
}

export interface CreateExperienceDto {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  employmentType: EmploymentType;
  companyLogoUrl: string;
  displayOrder: number;
}

export interface UpdateExperienceDto {
  company?: string;
  position?: string;
  location?: string;
  employmentType?: EmploymentType;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
  companyLogoUrl?: string;
  displayOrder?: number;
}