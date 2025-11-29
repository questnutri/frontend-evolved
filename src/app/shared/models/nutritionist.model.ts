import { Address } from "../interface/address.interface";

export interface Nutritionist {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender?: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    crn?: string;
    documentNumber?: string;
    documentType?: string;
    phone?: string;
    role?: string;
    addresses?: Address[];
    mainAddress?: Address;
}

export class NutritionistModel implements Nutritionist {
    id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    gender?: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    crn?: string;
    documentNumber?: string;
    documentType?: string;
    phone?: string;
    role?: string;
    addresses?: Address[];
    mainAddress?: Address;

    static from(nutritionist: Nutritionist): NutritionistModel {
        const model = new NutritionistModel();
        Object.assign(model, nutritionist);
        return model;
    }
}