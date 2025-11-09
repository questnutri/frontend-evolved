import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { QnDiv } from "@qn/components/basic";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth/auth.service';
import { NotificationService } from '../../services/notification/notification.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [
        FormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        QnDiv,
        RouterOutlet
    ],
    templateUrl: './not-logged.page.html',
    providers: []
})
export class NotLoggedLayout {
    protected readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly notificationService = inject(NotificationService);

    state = signal<'default' | 'reset-password'>('default');
    name = signal<string>('from login page');
    emailInput = signal<string>('');
    passwordInput = signal<string>('');

    constructor() {
        effect(() => {
            if (this.authService.isAuthenticated()) {
                this.router.navigate(['/', this.authService.userRole()]);
                this.notificationService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome back!' });
            }
        })
    }

    toggleResetPassword() {
        this.state.update(state => state === 'default' ? 'reset-password' : 'default');
    }

    doLogin() {
        this.authService.login(this.emailInput(), this.passwordInput());
    }


}
