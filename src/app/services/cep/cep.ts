import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';

export interface CepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CepService {

    private readonly apiUrl = 'https://viacep.com.br/ws';

    // Injeção moderna (Angular 14+)
    private http = inject(HttpClient);

    buscarCep(cep: string) {
        // Remove tudo que não for número
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            return of({ erro: true } as CepResponse);
        }

        return this.http.get<CepResponse>(`${this.apiUrl}/${cepLimpo}/json`).pipe(
            catchError(() => of({ erro: true } as CepResponse)),
            tap(data => console.log('Dados do ViaCEP:', data)) // opcional
        );
    }
}