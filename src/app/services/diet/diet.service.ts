import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Diet, DietModel } from "src/app/shared/models/diet.model";
import { ApiService } from "../api/api.service";

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

    async getDietPlan(dietId: string, date: Date) {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.get<any>(
                    `/diet/${dietId}/plan?monthlyView=true&date=${date.toISOString().split("T")[0]}`
                )
            );

            return response;
        } catch (error) {
            console.error('Error fetching diet plan:', error);
            return null;
        }
    }
}