export interface Nutritionist {
    id: string;
    name: string;
    email: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    crn?: string;
    documentNumber?: string;
    documentType?: string;
    phone?: string;
    role?: string;
}

export class NutritionistModel implements Nutritionist {
    id!: string;
    name!: string;
    email!: string;
    active?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    crn?: string;
    documentNumber?: string;
    documentType?: string;
    phone?: string;
    role?: string;

    static from(nutritionist: Nutritionist): NutritionistModel {
        const model = new NutritionistModel();
        Object.assign(model, nutritionist);
        return model;
    }
}