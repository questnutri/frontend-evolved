import { Component, EventEmitter, inject, output, signal } from '@angular/core';
import { QnDiv, QnTextInputComponent, QnButtonComponent } from "@qn/components/basic";
import { NotificationService } from '@qn/services';
import { QnLabelDirective } from "@qn/directives";

@Component({
    selector: 'forgot-password-request',
    templateUrl: './forgot-password-request.component.html',
    styleUrls: ['./forgot-password-request.component.scss'],
    imports: [QnDiv, QnTextInputComponent, QnButtonComponent, QnLabelDirective],
})
export class ForgotPasswordRequestComponent {
    private readonly notificationService = inject(NotificationService);

    email = signal<string>('');
    nextStep = output<void>();

    sendVerificationCode() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email())) {
            this.notificationService.add({
                severity: 'error',
                summary: 'E-mail inválido',
                detail: 'Por favor, insira um e-mail válido.'
            });
            return;
        }
        if (!this.email().trim()) {
            // Mostrar mensagem de erro
            console.log('Email inválido');
            return;
        }
        console.log('Código enviado para o email:', this.email());

        //mudança de step
        this.nextStep.emit();

        // Chamar API para enviar código
        // this.apiService.sendResetCode(this.email).subscribe(...)
    }
}
