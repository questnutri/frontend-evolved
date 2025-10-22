import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { InputNumber } from 'primeng/inputnumber';
import { QnNumberInputComponent } from '../qn-number-input/qn-number-input.component';

@Component({
    selector: 'app-qn-quantity-input',
    templateUrl: './qn-quantity-input.component.html',
    styleUrls: ['./qn-quantity-input.component.scss'],
    imports: [InputNumber, FormsModule, Fluid]
})
export class QnQuantityInputComponent extends QnNumberInputComponent {


}
