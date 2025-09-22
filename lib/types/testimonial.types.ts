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

// Use utility types
export type CreateTestimonialDto = Omit<Testimonial, 'id'>;
export type UpdateTestimonialDto = Partial<Omit<Testimonial, 'id'>>;