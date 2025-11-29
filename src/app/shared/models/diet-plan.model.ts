import { DietDayPlan, DietPlan } from "@qn/interfaces";
import { DietModel } from "./diet.model";
import { DietDayPlanModel } from "./diet-day-plan.model";

export class DietPlanModel implements DietPlan {
    diet!: DietModel;
    plan!: DietDayPlanModel[];
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

    merge(other: DietPlanModel): void {
        const map = new Map<string, DietDayPlanModel>();
        this.plan.forEach(p => map.set(p.relativeDate, p as DietDayPlanModel));
        other.plan.forEach(p => map.set(p.relativeDate, p as DietDayPlanModel));
        this.plan = Array.from(map.values()).sort((a, b) => a.relativeDate.localeCompare(b.relativeDate));
    }
}