import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QnInput } from '@qn/components/abstracts/qn-input.abstract';
import { TextareaModule } from 'primeng/textarea';
@Component({
    selector: 'qn-text-area',
    templateUrl: './qn-text-area.component.html',
    styleUrls: ['./qn-text-area.component.scss'],

    imports: [TextareaModule, FormsModule]
})
export class QnTextAreaComponent extends QnInput<string> {

    autocomplete = input<boolean>(false)
    rows = input<number>(5)
    cols = input<number>(30)

}
