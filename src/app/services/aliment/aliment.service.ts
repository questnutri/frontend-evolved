import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ApiService } from "../api/api.service";
import { AlimentModel } from "@qn/models";

interface ResponseAliments {
    data: {
        aliments: {
            currentPage: number,
            length: number,
            isFirstPage: boolean,
            isLastPage: boolean,
            totalPages: number,
            totalItems: number,
            items: AlimentModel[]
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class AlimentService {
    private readonly apiService = inject(ApiService);

    async getAliments(page: string = "1", items: string = "20", searchAliment: string | null, source: string | null = null): Promise<ResponseAliments | null> {
        const searchValue = searchAliment ? `\"${searchAliment}\"` : null;
        const sourceValue = source ? `\"${source}\"` : null;
        try {
            const response = await firstValueFrom(
                this.apiService.authenticated.post<any>('/aliment/graphql', {
                    "query": `query { aliments( source: ${sourceValue}, page: ${page}, items: ${items}, query: {name: ${searchValue} } ) { currentPage length isFirstPage isLastPage totalPages totalItems items { _id source name availablePortions portions } } }`
                })
            );

            return response?.data ?? null;
        } catch (error) {
            console.error('Erro GraphQL:', error);
            return null;
        }
    }

}
