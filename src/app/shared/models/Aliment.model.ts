import { PortionsModel, PortionPropertiesModel } from "./aliment-portion.model";

export interface Aliment {
    _id: string;
    name: string;
    availablePortions: string[];
    portions: PortionsModel;
    source?: string;
}

export class AlimentModel implements Aliment {
    _id!: string;
    name!: string;
    availablePortions: string[] = [];
    portions: PortionsModel = {};
    source?: string;

    static from(aliment: Aliment): AlimentModel {
        const model = new AlimentModel();
        Object.assign(model, aliment);
        model.portions = PortionsModel.from(aliment.portions);
        return model;
    }

    getPortion(portionName: string): PortionPropertiesModel {
        return this.portions[portionName];
    }
}