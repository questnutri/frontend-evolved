export interface Meal {
    id: string;
    name?: string;
    isActive?: boolean;
    hour?: string;
    repeatConfiguration?: any;
    createdAt?: Date;
    updatedAt?: Date;
    validFrom?: Date;
    validTo?: Date;
    foods: any[];
}


export class MealModel implements Meal {
    id!: string;
    name?: string;
    isActive?: boolean;
    hour?: string;
    repeatConfiguration?: any;
    createdAt?: Date;
    updatedAt?: Date;
    validFrom?: Date;
    validTo?: Date;
    foods: any[] = [];

    static from(meal: Meal): MealModel {
        const model = new MealModel();
        Object.assign(model, meal);
        return model;
    }
}