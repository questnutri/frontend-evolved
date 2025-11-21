import { ApiService } from './../api/api.service';
import { inject, Injectable } from "@angular/core";
import { Patient } from '@qn/models';
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private readonly apiService = inject(ApiService);

    async getAll(): Promise<Patient[]> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.get(`nutritionist/patients`)
            );

            console.log(response);


            return response as Patient[];

        } catch (error) {
            console.log(error);
            return [];
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
}