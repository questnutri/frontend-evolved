import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { Nutritionist, NutritionistModel } from "@qn/models";
import { NotificationService, ApiService } from "@qn/services";

@Injectable({
    providedIn: 'root'
})
export class NutritionistService {
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(Router);
    private readonly apiService = inject(ApiService);

    async getMe(): Promise<NutritionistModel | null> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.get<Nutritionist>(`nutritionist/me`)
            );
            if ("error" in response) {
                return null;
            }
            return NutritionistModel.from(response);
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async registerNutritionist(data: any): Promise<{ success: boolean, redirect: string | null }> {
        try {
            const response = await firstValueFrom(
                this.apiService.post<
                    { success: boolean, message: string, id: string }
                >(`nutritionist/register`, data)
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
