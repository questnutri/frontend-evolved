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
    private readonly api = inject(ApiService);

    async getWaterRecordsByDate(date: string) {
        const response = await firstValueFrom(
            this.api.authenticated.get<WaterDayResponse>(`/record/water/patient/${this.authService.userId()}/all?date=${date}`)
        );
        return response;
    }

    async registerWater(data: { amountInMl: string; operation: 'ADD' | 'SUB' }) {
        const response = await firstValueFrom(
            this.api.authenticated.post<{ success: boolean }>(`/record/water`, data)
        );
        return response;
    }


}