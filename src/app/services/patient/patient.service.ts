import { ApiService } from './../api/api.service';
import { inject, Injectable } from "@angular/core";
import { Patient, PatientModel } from '@qn/models';
import { ListResponse } from '@qn/types';
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private readonly apiService = inject(ApiService);

    async getAll(): Promise<ListResponse<Patient>> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.get<ListResponse<Patient>>(`/patient/all`)
            );

            return response;

        } catch (error) {
            console.log(error);
            return { items: [], totalItems: 0, totalPages: 0, currentPage: 0, lastPage: false, firstPage: false, exceededLastPage: false, itemsLength: 0, limit: 0 };
        }
    }

    async getById(id: string): Promise<Patient | null> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.get(`patient/${id}`)
            );
            return response as Patient;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getMe(): Promise<PatientModel> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.get<PatientModel>(`patient/me`)
            );
            return PatientModel.from(response);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}