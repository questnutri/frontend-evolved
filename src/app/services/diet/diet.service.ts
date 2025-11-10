import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { BACKEND_GATEWAY_URL } from "src/app/config/setup.token";
import { Diet, DietModel } from "src/app/shared/models/Diet.model";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: 'root'
})
export class DietService {
    private http = inject(HttpClient);
    private readonly BACKEND_GATEWAY_URL = inject(BACKEND_GATEWAY_URL);
    private readonly authService = inject(AuthService);

    async getDiets() {
        try {
            const response = await firstValueFrom(this.http.post<Diet[]>(`${this.BACKEND_GATEWAY_URL}/diet`, {
                patientId: '52d047c6-2cd7-49d2-b9a9-46f554b08f37',
                nutritionistId: '2cd6823c-b240-49e3-bb71-ca152f50f10d'
            },
                {
                    headers: {
                        authorization: `Bearer ${this.authService.authToken()}`
                    },
                }
            ));
            console.log(response)
            const diet = DietModel.from(response[0]);
            diet.getHello();

            return response;
        } catch (error) {
            console.error('Error fetching diets:', error);
            return []
        }
    }

    async getDietById(dietId: string) {
        try {
            const response = await firstValueFrom(this.http.get<Diet>(`${this.BACKEND_GATEWAY_URL}/diet/${dietId}`, {
                headers: {
                    authorization: `Bearer ${this.authService.authToken()}`
                }
            }));
            console.log(response);
            return DietModel.from(response);
        } catch (error) {
            console.error('Error fetching diet by ID:', error);
            return null;
        }
    }
}