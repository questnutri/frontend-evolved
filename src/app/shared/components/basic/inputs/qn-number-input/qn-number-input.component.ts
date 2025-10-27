import { Component, computed, input, model } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { QnComponent } from '@qn/components/abstracts/qn-component.abstract';

@Component({
    selector: 'app-qn-number-input',
    templateUrl: './qn-number-input.component.html',
    styleUrls: ['./qn-number-input.component.scss'],
    imports: [InputNumberModule, FormsModule, FloatLabelModule, IftaLabelModule]
})
export class QnNumberInputComponent extends QnComponent {
    value = model<number>()
    showPassword = input<boolean>(false)
    label = input<string>('')
    labelPosition = input<'over' | 'in' | 'on'>('over')
    mode = input<'decimal' | undefined>(undefined)
    minFractionDigits = input<number>(2)
    maxFractionDigits = input<number>(2)
    disabled = input<boolean>(false)
    clear = input<boolean>(false)
    thousendDivisor = input<boolean>(true)
    fontSize = input<'small' | 'large' | undefined>(undefined)
    suffix = input<string | undefined>(undefined)
    prefix = input<string | undefined>(undefined)

    minFractionDigitsComputed = computed(() => {
        return this.mode() !== undefined ? this.minFractionDigits() : undefined
    })
    maxFractionDigitsComputed = computed(() => {
        return this.mode() !== undefined ? this.maxFractionDigits() : undefined
    })

    suffixStandardized = computed(() => {
        return this.suffix() !== undefined ? ` ${this.suffix()}` : undefined
    })
    prefixStandardized = computed(() => {
        return this.prefix() !== undefined ? `${this.prefix()} ` : undefined
    })
}
