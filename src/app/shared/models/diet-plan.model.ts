import { DietPlan } from "@qn/interfaces";
import { DietDayPlanModel } from "./diet-day-plan.model";
import { DietModel } from "./diet.model";

export class DietPlanModel implements DietPlan {
    diet!: DietModel;
    plan!: DietDayPlanModel[];

    static from(dto: DietPlan): DietPlanModel {
        const model = new DietPlanModel();
        model.diet = DietModel.from(dto.diet);
        model.plan = dto.plan.map(DietDayPlanModel.from);

        return model;
    }

    merge(other: DietPlanModel): void {
        const map = new Map<string, DietDayPlanModel>();
        this.plan.forEach(p => map.set(p.relativeDate, p as DietDayPlanModel));
        other.plan.forEach(p => map.set(p.relativeDate, p as DietDayPlanModel));
        this.plan = Array.from(map.values()).sort((a, b) => a.relativeDate.localeCompare(b.relativeDate));
    }
}