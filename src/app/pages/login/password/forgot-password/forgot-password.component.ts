import { Component, EventEmitter, inject, output, signal } from '@angular/core';
import { QnDiv, QnTextInputComponent, QnButtonComponent } from "@qn/components/basic";
import { AuthService, NotificationService } from '@qn/services';
import { QnLabelDirective } from "@qn/directives";



@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    imports: [QnDiv, QnTextInputComponent, QnButtonComponent, QnLabelDirective],
})
export class ForgotPasswordComponent {
    private readonly notificationService = inject(NotificationService);
    private readonly authService = inject(AuthService)
    email = signal<string>('');
    nextStep = output<string | null>();

    async sendVerificationCode() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email())) {
            this.notificationService.add({
                severity: 'error',
                summary: 'E-mail inválido',
                detail: 'Por favor, insira um e-mail válido.'
            });
            return;
        }
        const res = await this.authService.forgotPassword(this.email());
        if (res.success) {
            this.nextStep.emit(res.data.resetPassword);
        } else {
            console.log('Falha - success é false'); // DEBUG
        }
        //por enquanto
        // this.nextStep.emit(null);

    }
}
