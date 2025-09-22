export interface Skill {
    id: number;
    name: string;
    category: string;
    level: string;
    displayOrder: number;
}

// Use utility types
export type CreateSkillDto = Omit<Skill, 'id'>;
export type UpdateSkillDto = Partial<Omit<Skill, 'id'>>;