import { Calculable } from "../interface/calculable.interface";
import { AlimentModel } from "./aliment.model";

export interface Food {
    id: string;
    description?: string;
    isActive?: boolean;
    portion?: string;
    quantity?: string;
    createdAt?: Date;
    updatedAt?: Date;
    validFrom?: Date;
    validTo: any;
    aliment: AlimentModel;
}

export class FoodModel implements Food, Calculable {
    id!: string;
    description?: string;
    isActive?: boolean;
    portion?: string;
    quantity?: string;
    createdAt?: Date;
    updatedAt?: Date;
    validFrom?: Date;
    validTo: any;
    aliment!: AlimentModel;

    static from(food: Food): FoodModel {
        const model = new FoodModel();
        Object.assign(model, food);
        model.aliment = AlimentModel.from(food.aliment);
        return model;
    }

    getTotal(nutrient: 'kcal' | 'carb' | 'protein' | 'fat'): number {
        if (this.portion) {
            const foundPortion = this.aliment.getPortion(this.portion);
            if (foundPortion) {
                const multiplier = parseFloat(this.quantity || '1') || 1;
                const value = this.parseValue(foundPortion.getNutrientValue(nutrient)) * multiplier;
                console.log(`Food: ${this.description}, Portion: ${this.portion}, Quantity: ${this.quantity}, Nutrient: ${nutrient}, Value: ${value}`);
                return value;
            }
        }
        return 0;
    }

    private parseValue(value: string): number {
        if (!value || value === 'NA' || value === 'Tr' || value === '') {
            return 0;
        }
        return parseFloat(value.replace(',', '.')) || 0;
    }

}