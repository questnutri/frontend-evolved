import { Component, computed, input, output, signal } from '@angular/core';
import { QnDiv, QnTextInputComponent, QnButtonComponent } from "@qn/components/basic";
import { InputOtpModule } from 'primeng/inputotp';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-token',
    templateUrl: './token.component.html',
    styleUrls: ['./token.component.scss'],
    imports: [QnDiv, QnTextInputComponent, QnButtonComponent, InputOtpModule, FormsModule],
})
export class TokenComponent {
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
        this.nextStep.emit();
    }
}