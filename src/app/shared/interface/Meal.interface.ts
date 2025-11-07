export interface AlimentPortion {
    alimentGroup: string;
    kcal: string;
    kJ: string;
    carb: string;
    protein: string;
    fat: string;
    humidity: string;
    dietaryFiber: string;
    cholesterol: string;
    sodium: string;
    calcium: string;
    magnesium: string;
    manganese: string;
    phosphorus: string;
    iron: string;
    potassium: string;
    copper: string;
    zinc: string;
    retinol: string;
    RE: string;
    RAE: string;
    thiamine: string;
    riboflavin: string;
    pyridoxine: string;
    niacin: string;
    vitaminC: string;
    ash: string;
}

export interface Aliment {
    source: string;
    _id: string;
    name: string;
    availablePortions: string[];
    portions: {
        [key: string]: AlimentPortion;
    };
}

export interface Food {
    isActive: boolean;
    id: string;
    quantity: string;
    portion: string;
    description: string | null;
    validFrom: string;
    validTo: string | null;
    createdAt: string;
    updatedAt: string;
    aliment: Aliment;
}

export interface RepeatConfiguration {
    type: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    interval: number;
    daysOfWeek?: number[];
}

export interface Meal {
    isActive: boolean;
    id: string;
    name: string;
    repeatConfiguration: RepeatConfiguration;
    hour: string;
    validFrom: string;
    validTo: string | null;
    createdAt: string;
    updatedAt: string;
    foods: Food[];
}

