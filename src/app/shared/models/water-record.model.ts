export interface WaterRecord {
    patientId: string;
    nutritionistId: string;
    amountInMl: string;
    operation: 'ADD' | 'SUB';
    registerHour: string;
    currentDailyWaterGoal: string;
    relativeDate: string;
    id: string;
    createdAt: string;
    totalIntake: number;
}

export interface WaterDayResponse {
    registers: WaterRecord[];
    totalIntake: number;
    currentDailyWaterGoal: string;

}