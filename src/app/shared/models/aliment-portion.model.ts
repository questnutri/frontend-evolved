export class PortionsModel {
    [key: string]: PortionPropertiesModel;
    static from(portionsData: any): PortionsModel {
        const model = new PortionsModel();
        Object.keys(portionsData).forEach(portionName => {
            model[portionName] = PortionPropertiesModel.from(portionsData[portionName]);
        }
        );
        return model;
    }
}

export class PortionPropertiesModel {
    [key: string]: any;

    static from(portionData: any): PortionPropertiesModel {
        const model = new PortionPropertiesModel();
        Object.assign(model, portionData);
        return model;
    }

    getNutrientValue(nutrient: string): number {
        const numericalValue = Number((this[nutrient] as string).replace(',', '.'));
        // console.log(`[PortionPropertiesModel] Getting nutrient value for: ${nutrient}`);
        // console.log(`[PortionPropertiesModel] Available keys: ${Object.keys(this).join(', ')}`);
        // console.log(`[PortionPropertiesModel] Raw value: ${this[nutrient]}`);
        // console.log(`[PortionPropertiesModel] Parsed numerical value: ${numericalValue}`);
        if (isNaN(Number(numericalValue))) return 0;
        return numericalValue;
    }
}