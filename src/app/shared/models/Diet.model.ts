import { MealModel } from "./Meal.model";

export interface Diet {
    id: string;
    name?: string;
    description?: string;
    patientId: string;
    nutritionistId: string;
    createdAt?: Date;
    updatedAt?: Date;
    startDate?: Date;
    endDate?: Date;
    meals: MealModel[];
}

export class DietModel implements Diet {
    id!: string;
    name?: string;
    description?: string;
    patientId!: string;
    nutritionistId!: string;
    createdAt?: Date;
    updatedAt?: Date;
    startDate?: Date;
    endDate?: Date;
    meals: MealModel[] = [];

    static from(diet: Diet): DietModel {
        const model = new DietModel();
        Object.assign(model, diet);
        return model;
    }

    getHello() {
        console.log('Hello');
    }
}