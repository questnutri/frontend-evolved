export interface Patient {
    id: string;
    firstName: string,
    lastName: string,
    email: string;
    phone: string,
    documentNumber: string;
    dateOfBirth: Date,
    gender: string,
    levelOfActivity: string,
    heightInCm: string,
    lastWeight: string | null,
    goals: string | null,
    medicalConditions: string | null,
    imc: string | null,
    tmb: string | null,
    tdee: string | null,
    preferences: string | null,
    notes: string | null,
    deletedAt: Date | null,
}