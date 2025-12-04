import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiService } from "../api/api.service";
import { AlimentModel } from "@qn/models";

@Injectable({
    providedIn: 'root'
})
export class AlimentService {
    private readonly apiService = inject(ApiService);

    async getAliments(): Promise<AlimentModel[] | null> {
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.post<any>('/aliment/graphql', {
                    "query": "query { aliments( source: null, page: null, items: 20, query: null ) { currentPage length isFirstPage isLastPage totalPages totalItems data { _id source name availablePortions portions } } }"
                })
            );

            return response?.data?.aliments?.data ?? null;
        } catch (error) {
            console.error('Erro GraphQL:', error);
            return null;
        }
    }
}