import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { QnComponent } from '@qn/components/abstracts/qn-component.abstract';
@Component({
    selector: 'app-qn-text-area',
    templateUrl: './qn-text-area.component.html',
    styleUrls: ['./qn-text-area.component.scss'],

    imports: [TextareaModule, FormsModule, FloatLabel]
})
export class QnTextAreaComponent extends QnComponent {

    value = model<string>('')
    label = input<string>('')
    placeholder = input<string>('')
    autocomplete = input<boolean>(false)
    disabled = input<boolean>(false)
    labelPosition = input<'over' | 'in' | 'on'>('over')
    type = input<"text" | "email">('text')
    fontSize = input<'small' | 'large'>('small')
    showMessageHelp = input<boolean>(false)
    messageHelp = input<string>('')

}
