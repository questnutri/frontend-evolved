import { Component, input } from '@angular/core';
import { QnInput } from '@qn/components/abstracts/qn-input.abstract';
import { QnDiv } from "../../qn-div/qn-div";
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'qn-mask-input',
    templateUrl: './qn-mask-input.component.html',
    styleUrls: ['./qn-mask-input.component.scss'],
    imports: [QnDiv, InputMaskModule, FormsModule],
})
export class QnMaskInputComponent extends QnInput {

    mask = input<string | null>(null);
    clearIcon = input<boolean>(false);
    min = input<number | null>(null);
    max = input<number | null>(null);
}
