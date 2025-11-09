export interface Nutritionist {
    id: string;
    name: string;
    email: string;
}

export class NutritionistModel implements Nutritionist {
    id!: string;
    name!: string;
    email!: string;

    static from(nutritionist: Nutritionist): NutritionistModel {
        const model = new NutritionistModel();
        Object.assign(model, nutritionist);
        return model;
    }
}