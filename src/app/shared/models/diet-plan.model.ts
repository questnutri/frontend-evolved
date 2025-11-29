import { DietDayPlan, DietPlan } from "@qn/interfaces";
import { DietModel } from "./diet.model";
import { DietDayPlanModel } from "./diet-day-plan.model";

export class DietPlanModel implements DietPlan {
    diet!: DietModel;
    plan!: DietDayPlan[];
    startDate!: Date;
    endDate: Date | null = null;

    static from(dto: DietPlan): DietPlanModel {
        const model = new DietPlanModel();
        model.diet = DietModel.from(dto.diet);
        model.plan = dto.plan.map(DietDayPlanModel.from);
        model.startDate = new Date(dto.startDate);
        model.endDate = dto.endDate ? new Date(dto.endDate) : null;
        return model;
    }
}