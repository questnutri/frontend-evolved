import { Component, inject, output, signal } from '@angular/core';
import { QnButtonComponent, QnDiv, QnPasswordInputComponent } from "@qn/components/basic";
import { NotificationService } from '@qn/services';

@Component({
    selector: 'forgot-password-verify',
    templateUrl: './forgot-password-verify.component.html',
    styleUrls: ['./forgot-password-verify.component.scss'],
    imports: [QnDiv, QnPasswordInputComponent, QnButtonComponent],
})
export class ForgotPasswordVerifyComponent {

    private readonly notificationService = inject(NotificationService);

    newPassword = signal<string>('');
    confirmPassword = signal<string>('');
    previousStep = output<void>();

    previous() {
        this.previousStep.emit();
    }

    resetPassword() {
        if (!this.newPassword || !this.confirmPassword) {
            this.notificationService.add({
                severity: 'error',
                summary: 'As duas senhas devem ser preenchidas!',
                detail: 'Por favor, preencha os dois campos.'
            })
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.notificationService.add({
                severity: 'error',
                summary: 'Senhas diferentes!',
                detail: 'Por favor, insira senhas que coincidam.'
            })
            this.newPassword.set('');
            this.confirmPassword.set('');
            return;
        }

        // Validar requisitos da senha
        if (this.newPassword.length < 8) {
            this.notificationService.add({
                severity: 'error',
                summary: 'Senha muito curta!',
                detail: 'A nova senha deve ter pelo menos 8 caracteres.'
            })
            return;
        }

        // Chamar API para redefinir senha
        // this.apiService.resetPassword(this.email, this.verificationCode, this.newPassword).subscribe(...)

        // Redirecionar para login
        console.log('Senha redefinida com sucesso!');
    }
}
