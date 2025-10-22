import { Component, input, model } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { QnComponent } from '../qn-component/qn-component.abstract';

@Component({
    selector: 'app-qn-text-input',
    templateUrl: './qn-text-input.component.html',
    styleUrls: ['./qn-text-input.component.scss'],
    imports: [InputTextModule, FormsModule, FloatLabel]
})
export class QnTextInputComponent extends QnComponent {
    value = model<string>('')
    label = input<string>('')
    placeholder = input<string>('')
    autocomplete = input<boolean>(false)
    disabled = input<boolean>(false)
    labelPosition = input<'over' | 'in' | 'on'>('over')
    type = input<"text" | "email">('text')
    fontSize = input<'small' | 'large' | undefined>(undefined)
    showMessageHelp = input<boolean>(false)
    messageHelp = input<string>('')

}


