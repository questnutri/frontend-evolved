import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-login-default-page',
    imports: [
        FormsModule,
        InputTextModule,
        PasswordModule,
<<<<<<< Updated upstream
        ButtonModule
=======
        ButtonModule,
>>>>>>> Stashed changes
    ],
    templateUrl: './default.html',
    styleUrl: './default.scss'
})
export class LoginDefaultPage {
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
