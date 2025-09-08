export interface Profile {
    id: string;
    userName: string;
    fullName?: string;
    email: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
    headline?: string;
    summary?: string;
    location?: string;
    updatedAt: string;
    createdAt: string;
}

export interface UpdateProfileDto {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
    headline?: string;
    summary?: string;
    location?: string;
}