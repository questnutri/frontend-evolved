import { Component, inject, OnInit, signal } from '@angular/core';
import { NavController } from '@ionic/angular';
import { QnDiv } from "@qn/components/basic";
import { ForgotPasswordStep2 } from './step2/forgot-password.step2';
import { ForgotPasswordStep1 } from './step1/forgot-password.step1';


@Component({
    selector: 'app-token-password',
    imports: [
        QnDiv,
        ForgotPasswordStep1,
        ForgotPasswordStep2
    ],
    templateUrl: './forgot-password.page.html',
    styleUrl: './forgot-password.page.scss'
})
export class ForgotPasswordPage implements OnInit {
    private readonly router = inject(NavController);

    currentStep = signal<number>(1);
    email = signal<string>('');
    resetToken = signal<string>('');
    verificationCode = signal<string>('');
    newPassword = signal<string>('');
    confirmPassword = signal<string>('');
    firstLogin = signal<boolean>(false);

    ngOnInit() {
        const state = window.history.state;

        if (state && state.firstLogin && state.tokenPassword) {
            this.firstLogin.set(state.firstLogin);
            this.resetToken.set(state.tokenPassword);
            this.currentStep.set(3);
        }
    }

    resendCode(event: Event) {
        event.preventDefault();
    }

    verifyCode() {
        this.currentStep.set(3);

        if (!this.verificationCode || this.verificationCode.length !== 6) {
            // Mostrar mensagem de erro
            return;
        }
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