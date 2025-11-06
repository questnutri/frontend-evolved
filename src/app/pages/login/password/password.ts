import { Component, inject, OnInit, signal } from '@angular/core';
import { NavController } from '@ionic/angular';
import { QnDiv } from "@qn/components/basic";
import { NotificationService } from '@qn/services';
import { ResetComponent } from "src/app/pages/login/password/reset/reset.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { TokenComponent } from "./token/token.component";

@Component({
    selector: 'app-token-password',
    imports: [QnDiv, ResetComponent, ForgotPasswordComponent, TokenComponent],
    templateUrl: './password.html',
    styleUrl: './password.scss'
})
export class LoginResetPasswordPage implements OnInit {
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(NavController);

    currentStep = signal<number>(1);
    email = signal<string>('');
    resetToken = signal<string>('');
    verificationCode = signal<string>('');
    newPassword = signal<string>('');
    confirmPassword = signal<string>('');
    firstLogin = signal<boolean>(false);

    ngOnInit() {
        // Recuperar os dados passados via state do NavController
        const state = window.history.state;

        if (state && state.firstLogin && state.tokenPassword) {
            this.firstLogin.set(state.firstLogin);
            this.resetToken.set(state.tokenPassword);
            this.currentStep.set(3);
        }
    }

    resendCode(event: Event) {
        event.preventDefault();
        // Chamar API para reenviar código
        // this.apiService.sendResetCode(this.email).subscribe(...)

        // Mostrar mensagem de sucesso
    }

    verifyCode() {
        this.currentStep.set(3);

        if (!this.verificationCode || this.verificationCode.length !== 6) {
            // Mostrar mensagem de erro
            return;
        }

        // Chamar API para verificar código
        // this.apiService.verifyCode(this.email, this.verificationCode).subscribe(...)

    }

    goToStep(step: number, token: string | null) {
        if (token) {
            this.resetToken.set(token);
        }
        this.currentStep.set(step);
    }

    goToLogin() {
        this.router.navigateRoot('/login');
    }
}