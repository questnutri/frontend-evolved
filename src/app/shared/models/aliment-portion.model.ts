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

    getNutrientValue(nutrient: string): any {
        return this[nutrient];
    }
}