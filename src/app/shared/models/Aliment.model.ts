export interface Aliment {
    _id: string;
    name: string;
    availablePortions: string[];
    portions: any;
    source?: string;
}


export class AlimentModel implements Aliment {
    _id!: string;
    name!: string;
    availablePortions: string[] = [];
    portions: any;
    source?: string;

    static from(aliment: Aliment): AlimentModel {
        const model = new AlimentModel();
        Object.assign(model, aliment);
        return model;
    }
}