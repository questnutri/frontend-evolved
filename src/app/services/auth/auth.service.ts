import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { USER_AUTH_LOCAL_STORAGE_NAME } from '../../shared/tokens/USER_AUTH_LOCAL_STORAGE_NAME.token';
import { UserModel } from '../../shared/models/User.model';
import { User } from '../../shared/interface/User.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BACKEND_GATEWAY_URL } from '../../config/setup.token';
import { firstValueFrom } from 'rxjs';
import { ApiHttpResponse } from '../../shared/types/api-http-response.type';
import { ErrorLoginResponse, SuccessLoginResponse } from '../../shared/types/login-response.type';
import { NotificationService } from '../notification/notification.service';

interface PaginationReponse<T> {
    data: T[],
    page: number,
    numberOfPages: number
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly USER_AUTH_LOCAL_STORAGE_NAME = inject(USER_AUTH_LOCAL_STORAGE_NAME);
    private readonly BACKEND_GATEWAY_URL = inject(BACKEND_GATEWAY_URL);

    private readonly notificationService = inject(NotificationService);

    private readonly _user = signal<UserModel | null>(null);
    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);

    private serviceRoute = 'auth'

    isLogged = computed(() => this._user() !== null);
    userRole = computed(() => this._user()?.role || null);

    constructor() {
        const storedUser = localStorage.getItem(this.USER_AUTH_LOCAL_STORAGE_NAME);
        if (storedUser) {
            this._user.set(UserModel.from(JSON.parse(storedUser) as User));
        }
        effect(() => {
            const user = this._user();
            if (user) {
                localStorage.setItem(this.USER_AUTH_LOCAL_STORAGE_NAME, JSON.stringify(user));
            } else {
                localStorage.removeItem(this.USER_AUTH_LOCAL_STORAGE_NAME);
            }
        })
    }

    async login(email: string, password: string): Promise<{ success: boolean, redirect: string | null }> {
        try {
            const response = await firstValueFrom(
                this.http.post<
                    ApiHttpResponse<SuccessLoginResponse, ErrorLoginResponse>
                >(`${this.BACKEND_GATEWAY_URL}/${this.serviceRoute}/login`, { email, password })
            );

            if ("error" in response) {
                return {
                    success: false,
                    redirect: null
                };
            }

            if ("firstLogin" in response) {
                response
                return {
                    success: true,
                    redirect: null
                };
            }

            this._user.set(UserModel.from({ role: response.role }));

            console.log('Navigating to /' + response.role.toLowerCase());
            return {
                success: true,
                redirect: `/${response.role.toLowerCase()}/home`
            };
        } catch (e: any) {
            console.log(e)
            this.notificationService.add({ severity: 'error', summary: 'Erro', detail: e.error?.message || 'Erro ao conectar com o servidor', life: 3000 });
            return {
                success: false,
                redirect: null
            }
        }

    }




    async logout() {
        this._user.set(null);
        this.router.navigate(['/login']);
    }

}
