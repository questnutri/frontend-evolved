import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiService } from "../api/api.service";
import { Diet, DietModel, MealModel } from "@qn/models";

interface CreateFoodDto {
    mealId: string,
    alimentId: string,
    quantity: string,
    portion: string,
    description: string
}

interface CreateMealDto {
    name: string,
    description: string | undefined,
    hour: string,
    dietId: string
}

@Injectable({
    providedIn: 'root'
})
export class MealService {
    private readonly apiService = inject(ApiService);

    async patchMeal(mealData: Partial<MealModel>, mealId: string): Promise<DietModel | boolean> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.patch<any>(`/diet/meals/${mealId}`, mealData)
            );
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error patching meal data:', error);
            throw error;
            return false;
        }
    }

    async postMeal(createMealDto: CreateMealDto): Promise<DietModel | boolean> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.post<any>(`/diet/meals`, { createMealDto })
            );
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error creating meal:', error);
            throw error;
            return false;
        }
    }
}