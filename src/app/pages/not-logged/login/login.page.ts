import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { QnButtonComponent, QnTextInputComponent, QnPasswordInputComponent, QnDiv } from '@qn/components/basic';

import {
    AuthService,
    NotificationService
} from '@qn/services';

import {
    QnLabelDirective
} from '@qn/directives';

@Component({
    selector: 'app-login-default-page',
    imports: [
        FormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        QnPasswordInputComponent,
        QnButtonComponent,
        QnTextInputComponent,
        QnLabelDirective,
        QnDiv
    ],
    templateUrl: './login.page.html',
    styleUrl: './login.page.scss'
})
export class LoginPage {
    protected readonly authService = inject(AuthService);
    private readonly router = inject(NavController);
    private readonly notificationService = inject(NotificationService);

    emailInput = signal<string>('');
    passwordInput = signal<string>('');

    value1 = signal<string>('');

    constructor() {
    }

    async doLogin() {
        const res = await this.authService.login(this.emailInput(), this.passwordInput());
        if ('error' in res) {
            this.notificationService.add({ severity: 'error', summary: 'Erro ao fazer login', detail: res.message });
            return;
        }

        if ('firstLogin' in res) {
            this.router.navigateRoot(`/forgot-password`, {
                state: {
                    firstLogin: res.firstLogin,
                    tokenPassword: res.resetPassword
                }
            });
        }

        if ('role' in res) {
            this.router.navigateRoot(`/${res.role}/home`)
        }

    }

    forgotPassword() {
        this.router.navigateRoot('/forgot-password')
    }
}
