export enum ProjectStatus {
  InProgress = 0,
  Completed = 1,
  OnHold = 2,
  Cancelled = 3
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  featuredImageUrl?: string;
  technologies?: string;
  repoUrl?: string;
  liveUrl?: string;
  isFeatured: boolean;
  status: ProjectStatus;
  displayOrder: number;
}

// Use utility types
export type CreateProjectDto = Omit<Project, 'id'>;
export type UpdateProjectDto = Partial<Omit<Project, 'id'>>;