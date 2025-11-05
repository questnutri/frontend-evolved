import { inject, Injectable } from "@angular/core";
import { BACKEND_GATEWAY_URL } from '../../config/setup.token';
import { NotificationService } from "../notification/notification.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NutritionistService {

    private readonly BACKEND_GATEWAY_URL = inject(BACKEND_GATEWAY_URL);
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);


    async registerNutritionist(data: any): Promise<{ success: boolean, redirect: string | null }> {
        try {
            const response = await firstValueFrom(
                this.http.post<
                    { success: boolean, message: string, id: string }
                >(`${this.BACKEND_GATEWAY_URL}/nutritionist/register`, data)
            );
            if (!response.success) {
                return {
                    success: false,
                    redirect: null
                };
            }

            return {
                success: true,
                redirect: `/login`
            };
        } catch (error: any) {
            console.error(error);
            this.notificationService.add({ severity: 'error', summary: 'Erro', detail: error.error.message || 'Erro ao conectar com o servidor', life: 3000 });
            return {
                success: false,
                redirect: null
            };
        }
    }

}
