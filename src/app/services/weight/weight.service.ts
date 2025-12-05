import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { WeightRecord } from 'src/app/shared/interface/weight.interface';
import { ListResponse } from 'src/app/shared/types/list-response.type';

@Injectable({
    providedIn: 'root',
})
export class WeightService {
    private readonly authService = inject(AuthService);
    private readonly apiService = inject(ApiService);

    async getAll(): Promise<ListResponse<WeightRecord>> {
        const patientId = this.authService.userId();
        const response = await firstValueFrom(
            this.apiService.authenticated.get<ListResponse<WeightRecord>>(
                `/record/weight/patient/${patientId}/all`
            )
        );
        return response;
    }

    async createOne(valueInKg: number): Promise<WeightRecord> {
        const payload = {
            valueInKg: valueInKg.toString(),
        };
        const response = await firstValueFrom(
            this.apiService.authenticated.post<WeightRecord>(
                `/record/weight`,
                payload
            )
        );
        return response;
    }


    async getAllByPatient(patientId: string): Promise<{ items: WeightRecord[] }> {
        const response = await firstValueFrom(
            this.apiService.authenticated.get<{ items: WeightRecord[] }>(
                `/record/weight/patient/${patientId}/all`
            )
        );
        return response;
    }
}