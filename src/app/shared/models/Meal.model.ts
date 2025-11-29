import { Calculable } from "../interface/calculable.interface";
import { FoodModel } from "./food.model";

export interface Meal {
    id: string;
    name?: string;
    hour?: string;
    repeatConfiguration?: any;
    createdAt?: Date;
    updatedAt?: Date;
    startDate: Date;
    endDate?: Date | null;
    foods: FoodModel[];
}

export class MealModel implements Meal, Calculable {
    id!: string;
    name?: string;
    hour?: string;
    repeatConfiguration?: any;
    createdAt?: Date;
    updatedAt?: Date;
    startDate!: Date;
    endDate?: Date | null;
    foods: FoodModel[] = [];

    static from(meal: Meal): MealModel {
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