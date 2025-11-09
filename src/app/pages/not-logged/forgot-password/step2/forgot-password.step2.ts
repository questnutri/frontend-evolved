import { Component, computed, inject, input, output, signal } from '@angular/core';
import { QnDiv, QnButtonComponent } from "@qn/components/basic";
import { InputOtpModule } from 'primeng/inputotp';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-token',
    templateUrl: './forgot-password.step2.html',
    imports: [
        QnDiv,
        QnButtonComponent,
        InputOtpModule,
        FormsModule
    ],
})
export class ForgotPasswordStep2 {
    private readonly router = inject(Router);

    email = signal<string>('');
    verificationCode = signal<string>('');
    token = input<string | null>('');
    firstLogin = input<boolean>(false);
    nextStep = output<void>();
    previousStep = output<void>();
    disabled = signal<boolean>(true);


    disableButton = computed(() => {
        console.log('verificationCode length:', this.verificationCode().length);
        return !(this.verificationCode().length === 6)
    })

    previous() {
        this.previousStep.emit();
    }

    verify() {
        this.router.navigate(['/reset-password']);
    }
}