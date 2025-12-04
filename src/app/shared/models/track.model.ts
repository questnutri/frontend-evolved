export interface TrackConfiguration {
    type: 'STREAK' | 'COUNTER';
    initialValue: string;
    updateValue?: string;
    historyStreak?: string;
    updateOperation: 'ADD' | 'SET';
    trackPropertyType: 'number' | 'string';
}

export interface Track {
    id: string;
    name: string;
    description: string | null;
    configuration: TrackConfiguration;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface GameTrack {
    trackId: string;
    userId: string;
    currentValue: string;
    createdAt: string;
    lastUpdatedAt: string;
    track: Track;
}

export class GameTrackModel implements GameTrack {
    trackId!: string;
    userId!: string;
    currentValue!: string;
    createdAt!: string;
    lastUpdatedAt!: string;
    track!: Track;

    static from(data: GameTrack): GameTrackModel {
        const model = new GameTrackModel();
        Object.assign(model, data);
        return model;
    }
}