export interface Testimonial {
  id: number;
  content: string;
  clientName: string;
  clientTitle?: string;
  clientCompany?: string;
  clientImageUrl?: string;
  rating?: number;
  isApproved: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

export interface CreateTestimonialDto {
  content: string;
  clientName: string;
  clientTitle?: string;
  clientCompany?: string;
  clientImageUrl?: string;
  rating?: number;
  isApproved: boolean;
  isFeatured: boolean;
  displayOrder: number;
}

export interface UpdateTestimonialDto {
  id: number;
  content: string;
  clientName: string;
  clientTitle?: string;
  clientCompany?: string;
  clientImageUrl?: string;
  rating?: number;
  isApproved: boolean;
  isFeatured: boolean;
  displayOrder: number;
}