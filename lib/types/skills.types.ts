export interface Skill {
    id: number;
    name: string;
    category: string;
    level: string;
    displayOrder: number;
}

export interface CreateSkillDto {
    name: string;
    category: string;
    level: string;
    displayOrder: number;
}

export interface UpdateSkillDto {
    name: string;
    category?: string;
    level?: string;
    displayOrder?: number;
}