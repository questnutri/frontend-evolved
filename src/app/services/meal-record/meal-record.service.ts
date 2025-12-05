import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { firstValueFrom } from 'rxjs';

export interface MealRecord {
    id: string;
    dietId: string;
    mealId: string;
    expectedHour: string;
    conclusionHour: string | null;
    patientId: string;
    nutritionistId: string;
    isCompleted: boolean;
    relativeDate: string;
    createdAt: string;
    updatedAt: string;
    meal?: {
        id: string;
        name: string;
    };
}

export interface DailyMealBreakdown {
    date: string;
    expectedMeals: number;
    completedMeals: number;
    incompleteMeals: number;
    completionRate: number;
    records: MealRecord[];
}

export interface MealRecordResponse {
    dietId: string;
    dateRange: {
        start: string;
        end: string;
    };
    summary: {
        totalExpectedMeals: number;
        completedMeals: number;
        incompleteMeals: number;
        completionRate: number;
    };
    dailyBreakdown: DailyMealBreakdown[];
}

@Injectable({
    providedIn: 'root'
})
export class MealRecordService {
    private readonly apiService = inject(ApiService);

    async getByPatientAndRange(
        patientId: string,
        startDate: string,
        endDate: string
    ): Promise<MealRecordResponse> {
        const response = await firstValueFrom(
            this.apiService.authenticated.get<MealRecordResponse>(
                `/record/meal/patient/${patientId}/all`,
                {
                    params: {
                        startDate,
                        endDate
                    }
                }
            )
        );
        return response;
    }

    async getByRange(startDate: string, endDate: string): Promise<MealRecordResponse> {
        const response = await firstValueFrom(
            this.apiService.authenticated.get<MealRecordResponse>(
                `/record/meal/all`,
                {
                    params: {
                        startDate,
                        endDate
                    }
                }
            )
        );
        return response;
    }
}