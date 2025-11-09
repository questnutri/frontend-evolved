import { computed, effect, inject, Injectable, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BACKEND_GATEWAY_URL } from '../../config/setup.token';
import { firstValueFrom } from 'rxjs';
import { ApiHttpResponse } from '../../shared/types/api-http-response.type';
import { AuthPayload, ErrorLoginResponse, SuccessLoginResponse } from '../../shared/types/login-response.type';
import { NotificationService } from '../notification/notification.service';
import { ApiInteraction } from '@qn/types';
import { AUTH_LOCAL_STORAGE_NAMES } from 'src/app/shared/tokens/AUTH_LOCAL_STORAGE_NAMES.token';
import { UserRole } from 'src/app/shared/enum/user/user-role.enum';
import { StorageService } from '../storage/storage.service';

interface PaginationReponse<T> {
    data: T[],
    page: number,
    numberOfPages: number
}

interface ForgotPasswordResponse {
    resetPassword: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly BACKEND_GATEWAY_URL = inject(BACKEND_GATEWAY_URL);
    private readonly notificationService = inject(NotificationService);
    private readonly storageService = inject(StorageService);

    private readonly auth = signal<AuthPayload | null>(null);

    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);

    private serviceRoute = 'auth'

    isAuthenticated = computed(() => this.auth() !== null);

    accessToken = computed(() => this.auth()?.accessToken || null);
    userRole = computed(() => this.auth()?.role || null);
    userId = computed(() => this.auth()?.id || null);

    private resetToken = signal<string | null>(null);

    canReset = computed(() => {
        return this.resetToken() !== null;
    })

    constructor() {
        this.auth.set(this.storageService.get<AuthPayload>('auth'));
        effect(() => {
            const auth = this.auth();
            const current = this.storageService.get<AuthPayload>('auth');
            if (auth && JSON.stringify(current) !== JSON.stringify(auth)) {
                this.storageService.add({ auth });
            } else if (!auth && current) {
                this.storageService.remove('auth');
            }
        });

    };

    async login(email: string, password: string): Promise<SuccessLoginResponse | ErrorLoginResponse> {
        try {
            const response = await firstValueFrom(
                this.http.post<
                    ApiHttpResponse<SuccessLoginResponse, ErrorLoginResponse>
                >(`${this.BACKEND_GATEWAY_URL}/${this.serviceRoute}/login`, { email, password })
            );

            if ("error" in response) {
                return {
                    error: true,
                    message: response.message
                };
            }

            if ("firstLogin" in response) {
                this.resetToken.set(response.resetPassword);
                return {
                    firstLogin: true,
                    resetPassword: response.resetPassword
                };
            };
            this.auth.set(response);
            return response;

        } catch (e: any) {
            this.notificationService.add({ severity: 'error', summary: 'Erro', detail: e.error?.message || 'Erro ao conectar com o servidor', life: 3000 });
            return {
                error: true,
                message: e.error?.message || 'Erro ao conectar com o servidor'
            }
        }

    }

    async forgotPassword(email: string): Promise<ApiInteraction<ForgotPasswordResponse>> {
        try {
            const response = await firstValueFrom(
                this.http.post<ApiHttpResponse<ForgotPasswordResponse>>(`${this.BACKEND_GATEWAY_URL}/${this.serviceRoute}/forgot-password`, { email })
            );

            if ("error" in response) {
                throw new Error(`${response.error}`);
            }

            this.resetToken.set(response.resetPassword);

            return {
                success: true,
                data: response
            };
        } catch (e: any) {
            console.error(e);
            this.notificationService.add({ severity: 'error', summary: 'Erro', detail: e.error?.message || 'Erro ao conectar com o servidor', life: 3000 });
            return {
                success: false,
                error: e.error.message,
                type: e.error.error
            }
        }
    }

    async resetPassword(resetPasswordToken: string | null, newPassword: string): Promise<ApiInteraction<AuthPayload>> {
        try {
            const response = await firstValueFrom(
                this.http.post<ApiHttpResponse<AuthPayload>>(`${this.BACKEND_GATEWAY_URL}/${this.serviceRoute}/reset-password`, { resetPasswordToken, newPassword })
            );

            if ("error" in response) {
                throw new Error(`${response.error}`);
            }

            this.resetToken.set(null);
            this.auth.set(response);
            return {
                success: true,
                data: response
            };
        } catch (e: any) {
            console.error(e);
            this.notificationService.add({ severity: 'error', summary: 'Erro', detail: e.error?.message || 'Erro ao conectar com o servidor', life: 3000 });
            return {
                success: false,
                error: e.error.message,
                type: e.error.error
            }
        }
    }

    async logout() {
        this.auth.set(null);
        this.router.navigate(['/login']);
    }

}
