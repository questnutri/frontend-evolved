import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QnComponent } from '@qn/components/abstracts/qn-component.abstract';
import { SelectModule } from 'primeng/select';
import { QnDiv } from "../qn-div/qn-div";

@Component({
    selector: 'qn-drop-down',
    templateUrl: './qn-drop-down.component.html',
    styleUrls: ['./qn-drop-down.component.scss'],
    imports: [SelectModule, FormsModule, QnDiv],
    standalone: true
})
export class QnDropDownComponent extends QnComponent {

    value = model<string>();
    placeholder = input<string | undefined>();
    options = input<Array<{ label: string, value: string }>>([]);
    disabled = input<boolean>(false);

    valueChange(newValue: string | null) {
        this.value.set(newValue || '');
    }
}
