import { Calculable } from "../interface/calculable.interface";
import { AlimentModel } from "./aliment.model";

export interface Food {
    id: string;
    description?: string;
    portion?: string;
    quantity?: string;
    createdAt?: Date;
    updatedAt?: Date;
    startDate: Date;
    endDate?: Date | null;
    aliment: AlimentModel;
}

export class FoodModel implements Food, Calculable {
    id!: string;
    description?: string;
    portion?: string;
    quantity?: string;
    createdAt?: Date;
    updatedAt?: Date;
    startDate!: Date;
    endDate?: Date | null;
    aliment!: AlimentModel;

    static from(food: Food): FoodModel {
        const model = new FoodModel();
        Object.assign(model, food);
        try {
            model.aliment = AlimentModel.from(food.aliment);
        } catch (error) {
            console.error(error)
        }

        return model;
    }

    getTotal(nutrient: 'kcal' | 'carb' | 'protein' | 'fat'): number {
        // console.log(`[FoodModel] Getting total nutritient for: ${nutrient}`);
        if (this.portion) {
            const foundPortion = this.aliment.getPortion(this.portion);
            if (foundPortion) {
                const multiplier = parseFloat(this.quantity || '1') || 1.0;
                let nutritientRawValue = foundPortion.getNutrientValue(nutrient);
                // console.log(`[FoodModel] Portion was found! Trying to get nutrient value...`);
                // console.log(`[FoodModel] Nutrient raw value: ${nutritientRawValue}, Multiplier: ${multiplier}`);
                return nutritientRawValue * multiplier;
            }
        }
        return 0;
    }

    private parseValue(value: string): number {
        // console.log(`Parsing value: ${value}`);
        if (!value || value === 'NA' || value === 'Tr' || value === '') {
            return 0;
        }
        // console.log(`Parsed value: ${value.replace(',', '.')}`);
        return parseFloat(value.replace(',', '.')) || 0;
    }

}