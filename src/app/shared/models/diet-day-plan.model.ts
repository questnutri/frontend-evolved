import { DietDayPlan } from './../interface/diet-plan.interface';
import { MealModel } from './meal.model';

export class DietDayPlanModel implements DietDayPlan {
    relativeDate!: string;
    mealPlans!: { meal: MealModel; mealRecord: any }[];

    static from(dto: DietDayPlan): DietDayPlanModel {
        const model = new DietDayPlanModel();
        model.relativeDate = dto.relativeDate;
        model.mealPlans = dto.mealPlans.map(mp => ({
            meal: MealModel.from(mp.meal),
            mealRecord: mp.mealRecord
        }));
        return model;
    }
}