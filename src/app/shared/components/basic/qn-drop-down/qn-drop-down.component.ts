import { Component, input, model } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FloatLabel } from "primeng/floatlabel"
import { FormsModule } from '@angular/forms';
import { QnComponent } from '@qn/components/abstracts/qn-component.abstract';

@Component({
    selector: 'app-qn-drop-down',
    templateUrl: './qn-drop-down.component.html',
    styleUrls: ['./qn-drop-down.component.scss'],
    imports: [SelectModule, FloatLabel, FormsModule]
})
export class QnDropDownComponent extends QnComponent {

    value = model<string | null>(null);
    placeholder = input<string | undefined>();
    label = input<string>('');
    options = input<Array<{ label: string, value: string }>>([]);
    disabled = input<boolean>(false);
}
