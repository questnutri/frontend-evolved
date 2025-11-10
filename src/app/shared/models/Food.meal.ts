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
    aliment: any;
}


export class FoodMeal implements Food {
    id!: string;
    description?: string;
    isActive?: boolean;
    portion?: string;
    quantity?: string;
    createdAt?: Date;
    updatedAt?: Date;
    validFrom?: Date;
    validTo: any;
    aliment: any;

    static from(food: Food): FoodMeal {
        const model = new FoodMeal();
        Object.assign(model, food);
        return model;
    }

}