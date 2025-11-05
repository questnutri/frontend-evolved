import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QnDiv } from "@qn/components/basic";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification/notification.service';
import { LoginDefaultPage } from './default/default';

@Component({
    selector: 'app-login',
    imports: [
        LoginDefaultPage,
        FormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        QnDiv,
    ],
    templateUrl: './login.page.html',
    providers: []
})
export class LoginPage {
    state = signal<'default' | 'reset-password'>('default');
    name = signal<string>('from login page');

    toggleResetPassword() {
        this.state.update(state => state === 'default' ? 'reset-password' : 'default');
    }

    protected readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly notificationService = inject(NotificationService);

    emailInput = signal<string>('');
    passwordInput = signal<string>('');

    constructor() {
        effect(() => {
            if (this.authService.isLogged()) {
                this.router.navigate(['/', this.authService.userRole()]);
                this.notificationService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome back!' });
            }
        })
    }

    doLogin() {
        this.authService.login(this.emailInput(), this.passwordInput());
    }


}
