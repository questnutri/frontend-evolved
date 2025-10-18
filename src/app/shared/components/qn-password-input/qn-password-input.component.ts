import { Component, input, model, signal } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
    selector: 'app-qn-password-input',
    templateUrl: './qn-password-input.component.html',
    styleUrls: ['./qn-password-input.component.scss'],
    imports: [PasswordModule, FormsModule, FloatLabelModule]
})
export class QnPasswordInputComponent {

    value = model<string>('')
    showPassword = input<boolean>(false)
    label = input<string>('')
    placeholder = input<string>('')
    labelPosition = input<'over' | 'in' | 'on'>('over')
    disabled = input<boolean>(false)
    fontSize = input<'small' | 'large' | undefined>(undefined)
}
