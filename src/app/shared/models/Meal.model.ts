import { Calculable } from "../interface/calculable.interface";
import { FoodModel } from "./food.model";

export interface RepeatConfiguration {
    type: 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    repeatTarget?: number;      // Usado em DAILY, WEEKLY, MONTHLY
    daysOfWeek?: number[];      // Usado apenas em WEEKLY
    daysOfMonth?: number[];     // Usado apenas em MONTHLY
    targetDate?: string | Date; // Usado apenas em ONCE
}

export interface Meal {
    id: string;
    name?: string;
    hour?: string;
    repeatConfiguration?: RepeatConfiguration;
    createdAt?: Date;
    updatedAt?: Date;
    startDate: Date;
    endDate?: Date | null;
    foods: FoodModel[];
    description?: string;
}

export class MealModel implements Meal, Calculable {
    id!: string;
    name?: string;
    hour?: string;
    repeatConfiguration?: RepeatConfiguration;
    createdAt?: Date;
    updatedAt?: Date;
    startDate!: Date;
    endDate?: Date | null;
    foods: FoodModel[] = [];
    description?: string;

    static from(meal: Meal): MealModel {
        console.log('Meal model: ', meal)
        const model = new MealModel();
        Object.assign(model, meal);
        model.foods = meal.foods.map(food => FoodModel.from(food));
        return model;
    }

    getTotal(nutrient: "kcal" | "carb" | "protein" | "fat"): number {
        return this.foods.reduce((total, food) => {
            return total + food.getTotal(nutrient);
        }, 0);
    }
}