import { Calculable } from "../interface/calculable.interface";
import { MealModel } from "./meal.model";

export interface Diet {
    id: string;
    name?: string;
    description?: string;
    patientId: string;
    nutritionistId: string;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date;
    endDate?: Date;
    status?: string;
    meals: MealModel[];
}

export class DietModel implements Diet, Calculable {
    id!: string;
    name?: string;
    description?: string;
    patientId!: string;
    nutritionistId!: string;
    createdAt!: Date;
    updatedAt!: Date;
    startDate!: Date;
    endDate?: Date;
    status?: string;
    meals: MealModel[] = [];

    static from(diet: Diet): DietModel {
        const model = new DietModel();
        Object.assign(model, diet);
        model.meals = diet.meals.map(meal => MealModel.from(meal));
        return model;
    }

    getTotal(nutrient: "kcal" | "carb" | "protein" | "fat"): number {
        return this.meals.reduce((total, meal) => {
            return total + meal.getTotal(nutrient);
        }, 0);
    }
}