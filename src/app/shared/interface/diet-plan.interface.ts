import { DietModel, MealModel } from "@qn/models";

export interface MealPlan {
    meal: MealModel;
    mealRecord: any;
}

export interface DietDayPlan {
    relativeDate: string;
    mealPlans: MealPlan[];
}

export interface DietPlan {
    diet: DietModel;
    plan: DietDayPlan[];
    // startDate: Date;
    // endDate?: Date | null;
}
