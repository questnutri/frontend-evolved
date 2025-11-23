export interface Address {
    country: string,
    name: string,
    street: string,
    number: string,
    complement: string,
    neighborhood: string,
    city: string,
    state: string;
    zipCode: string,
    nutritionistId: string,
    id: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null
}