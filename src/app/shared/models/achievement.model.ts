import { i18n } from "../interface/i18n.interface";
import { NotificationMessage } from "../interface/notification.interface";

export interface Achievement {
    id: string;
    i18n: i18n<{
        name: string;
        description: string;
        unlockNotification: NotificationMessage
    }>
    trackId: string;
    targetValue: string;
    unlockedAt?: Date | null;
    icon?: string;
    rarity: AchievementRarity;
}

export enum AchievementRarity {
    COMMON = 'COMMON',
    RARE = 'RARE',
    EPIC = 'EPIC',
    LEGENDARY = 'LEGENDARY',
    QUESTNUTRI_MASTER = 'QUESTNUTRI_MASTER'
}

export class AchievementModel implements Achievement {
    id!: string;
    i18n!: i18n<{
        name: string;
        description: string;
        unlockNotification: NotificationMessage
    }>
    trackId!: string;
    targetValue!: string;
    unlockedAt?: Date | null;
    rarity!: AchievementRarity;
    icon?: string | undefined;

    static from(achievement: Achievement): AchievementModel {
        const model = new AchievementModel();
        Object.assign(model, achievement);
        return model;
    }
}