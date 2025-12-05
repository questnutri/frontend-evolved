import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Diet, DietModel } from "src/app/shared/models/diet.model";
import { ApiService } from "../api/api.service";

export interface PatchDietDTO {
    name: string | null;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
    patientId: string | null;
}
export interface CreateDietDTO {
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    patientId: string;
}

@Injectable({
    providedIn: 'root'
})
export class DietService {
    private readonly apiService = inject(ApiService);

    async getDiets(patientId: string): Promise<DietModel[]> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.get<Diet[]>(
                    `/diet/patients/${patientId}`
                )
            );
            return response;
        } catch (error) {
            console.error('Error fetching diet by ID:', error);
            return []; // <<--- nunca retorne null
        }
    }

    async getDietById(dietId: string) {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.get<Diet>(
                    `/diet/${dietId}`));
            return DietModel.from(response);
        } catch (error) {
            console.error('Error fetching diet by ID:', error);
            return null;
        }
    }

    async getDietPlanForCurrent() {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.get<any>(
                    `/diet/current/plan?monthlyView=true&includeRecords=true`
                )
            );
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error fetching diet plan:', error);
            return null;
        }
    }

    async getDietPlan(dietId: string, date: Date) {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.get<any>(
                    `/diet/${dietId}/plan?monthlyView=true&date=${date.toISOString().split("T")[0]}`
                )
            );
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error fetching diet plan:', error);
            return null;
        }
    }

    async patchDiet(dietId: string, dietData: Partial<PatchDietDTO>): Promise<boolean> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.patch<Diet>(
                    `/diet/${dietId}`,
                    dietData
                )
            );

            return true;
        } catch (error) {
            console.error('Error patching diet:', error);
            return false;
        }
    }

    async createDiet(dietData: CreateDietDTO): Promise<DietModel | null> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.post<Diet>(
                    `/diet`,
                    dietData
                )
            );

            return DietModel.from(response);
        } catch (error) {
            console.error('Error creating diet:', error);
            return null;
        }
    }

    async activetDiet(dietId: string): Promise<boolean> {
        try {
            const result = await firstValueFrom(
                this.apiService.authenticated.post<Diet>(
                    `/diet/${dietId}/activate`,
                    {}
                )
            );
            return true;
        } catch (error) {
            console.error('Error activating diet:', error);
            return false;
        }
    }
}