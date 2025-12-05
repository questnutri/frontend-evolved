export interface WeightRecord {
    id: string;
    valueInKg: string;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    registeredBy?: {
        role: string;
        userId: string;
    };
}