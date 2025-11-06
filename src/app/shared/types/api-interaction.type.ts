export type ApiInteraction<T> = {
    success: true;
    data: T;
} | {
    success: false;
    error: string;
    type: string;
}