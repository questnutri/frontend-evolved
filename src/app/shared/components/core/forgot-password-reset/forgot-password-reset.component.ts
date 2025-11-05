import { Component, output, signal } from '@angular/core';
import { QnDiv, QnTextInputComponent, QnButtonComponent } from "@qn/components/basic";

@Component({
    selector: 'forgot-password-reset',
    templateUrl: './forgot-password-reset.component.html',
    styleUrls: ['./forgot-password-reset.component.scss'],
    imports: [QnDiv, QnTextInputComponent, QnButtonComponent],
})
export class ForgotPasswordResetComponent {
    email = signal<string>('');
    verificationCode = signal<string>('');

    nextStep = output<void>();
    previousStep = output<void>();


    previous() {
        this.previousStep.emit();
    }

    verify() {

        this.nextStep.emit();
    }
}
