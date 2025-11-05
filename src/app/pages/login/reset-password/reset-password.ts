import { Component, inject, signal } from '@angular/core';
import { QnDiv, QnButtonComponent } from "@qn/components/basic";
import { NotificationService } from '@qn/services';
import { ForgotPasswordRequestComponent } from "src/app/shared/components/core/forgot-password-request/forgot-password-request.component";
import { ForgotPasswordResetComponent } from "src/app/shared/components/core/forgot-password-reset/forgot-password-reset.component";
import { ForgotPasswordVerifyComponent } from "src/app/shared/components/core/forgot-password-verify/forgot-password-verify.component";

@Component({
    selector: 'app-reset-password',
    imports: [QnDiv, ForgotPasswordRequestComponent, ForgotPasswordVerifyComponent, ForgotPasswordResetComponent, QnButtonComponent],
    templateUrl: './reset-password.html',
    styleUrl: './reset-password.scss'
})
export class LoginResetPasswordPage {
    private readonly notificationService = inject(NotificationService);
    currentStep = signal<number>(1);
    email = signal<string>('');
    verificationCode = signal<string>('');
    newPassword = signal<string>('');
    confirmPassword = signal<string>('');



    resendCode(event: Event) {
        event.preventDefault();
        // Chamar API para reenviar código
        // this.apiService.sendResetCode(this.email).subscribe(...)

        // Mostrar mensagem de sucesso
        console.log('Código reenviado!');
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



    goToStep(step: number) {
        this.currentStep.set(step);
    }
}