import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiService } from "../api/api.service";
import { FoodModel } from "@qn/models";

interface CreateFoodDto {
    mealId: string,
    alimentId: string,
    quantity: string,
    portion: string,
    description: string
}

@Injectable({
    providedIn: 'root'
})
export class FoodService {
    private readonly apiService = inject(ApiService);

    async postFood(foodData: CreateFoodDto): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.post<any>('/diet/foods', foodData)
            );
            console.log(response);

            return response;
        } catch (error) {
            console.error('Error posting food data:', error);
            throw error;
        }
    }

    async deleteFood(foodId: string): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.delete<any>(`/diet/foods/${foodId}`)
            );
            console.log(response);

            return response;
        } catch (error) {
            console.error('Error deleting food data:', error);
            throw error;

        }
    }

    async patchFood(mealId: string, foodId: string, foodData: Partial<FoodModel>): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.put<any>(`/diet/foods/${foodId}`, foodData)
            );
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error updating food data:', error);
            throw error;
        }
    }
}