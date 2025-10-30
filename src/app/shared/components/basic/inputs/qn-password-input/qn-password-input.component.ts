import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { QnTextInputComponent } from '../qn-text-input/qn-text-input.component';
import { QnDiv } from "../../qn-div/qn-div";

@Component({
    selector: 'qn-password-input',
    templateUrl: './qn-password-input.component.html',
    styleUrls: ['./qn-password-input.component.scss'],
    imports: [PasswordModule, FormsModule, FloatLabelModule, QnDiv]
})
export class QnPasswordInputComponent extends QnTextInputComponent {
    showPassword = input<boolean>(true)
}
