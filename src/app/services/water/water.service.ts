import { inject, Injectable } from "@angular/core";
import { ApiService } from "../api/api.service";
import { firstValueFrom } from "rxjs";
import { WaterDayResponse } from "src/app/shared/models/water-record.model";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class WaterService {
    private readonly authService = inject(AuthService);
    private readonly apiService = inject(ApiService);

    async getWaterRecordsByDateAndPatient(date: string, patientId: string): Promise<WaterDayResponse> {
        const response = await firstValueFrom(
            this.apiService.authenticated.get<WaterDayResponse>(
                `/record/water/patient/${patientId}/all`,
                {
                    params: {
                        date,
                        includeRegisters: true
                    }
                }
            )
        );
        return response;
    }

    /**
     * Get water records for a date range for the current patient
     * @param startDate - Start date in YYYY-MM-DD format
     * @param endDate - End date in YYYY-MM-DD format
     * @returns Water records for the date range
     */
    async getWaterRecordsByRange(startDate: string, endDate: string): Promise<any> {
        const id = this.authService.userId();
        const response = await firstValueFrom(
            this.apiService.authenticated.get<any>(
                `/record/water/patient/${id}/all`,
                {
                    params: {
                        startDate,
                        endDate,
                        includeRegisters: 'true'
                    }
                }
            )
        );
        return response;
    }

    /**
     * Get water records for a date range for a specific patient (for nutritionist view)
     * @param startDate - Start date in YYYY-MM-DD format
     * @param endDate - End date in YYYY-MM-DD format
     * @param patientId - Patient's ID
     * @returns Water records for the date range
     */
    async getWaterRecordsByRangeAndPatient(
        startDate: string, 
        endDate: string, 
        patientId: string
    ): Promise<any> {
        const response = await firstValueFrom(
            this.apiService.authenticated.get<any>(
                `/record/water/patient/${patientId}/all`,
                {
                    params: {
                        startDate,
                        endDate,
                        includeRegisters: 'true'
                    }
                }
            )
        );
        return response;
    }

    async getAllWaterRecordsByPatient(patientId: string): Promise<WaterDayResponse> {
        const response = await firstValueFrom(
            this.apiService.authenticated.get<WaterDayResponse>(
                `/record/water/patient/${patientId}/all`,
                {
                    params: {
                        includeRegisters: true
                    }
                }
            )
        );
        return response;
    }

    async registerWater(data: { amountInMl: string; operation: 'ADD' | 'SUB' }) {
        const response = await firstValueFrom(
            this.apiService.authenticated.post<{ success: boolean }>(`/record/water`, data)
        );
        return response;
    }

    async getWaterRecordsByDate(date: string) {
        const response = await firstValueFrom(
            this.apiService.authenticated.get<WaterDayResponse>(`/record/water/patient/${this.authService.userId()}/all?date=${date}`)
        );
        return response;
    }
}