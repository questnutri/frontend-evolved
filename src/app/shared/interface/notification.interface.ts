import { i18n } from "./i18n.interface";

export interface NotificationMessage {
    title?: string;
    message: string;
}

export interface Notification {
    id: string;
    type: any;
    i18n: i18n<NotificationMessage>;
    createdAt: Date;
    acknowledgeAt?: Date | null;
}