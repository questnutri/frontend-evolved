import { Component, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QnInput } from '@qn/components/abstracts/qn-input.abstract';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { QnDiv } from '@qn/components/basic'

@Component({
    selector: 'qn-number-input',
    templateUrl: './qn-number-input.component.html',
    styleUrls: ['./qn-number-input.component.scss'],
    imports: [InputNumberModule, FormsModule, FloatLabelModule, IftaLabelModule, QnDiv]
})
export class QnNumberInputComponent extends QnInput<number> {
    mode = input<'decimal' | undefined>(undefined)
    minFractionDigits = input<number>(2)
    maxFractionDigits = input<number>(2)
    clear = input<boolean>(false)
    thousendDivisor = input<boolean>(true)
    suffix = input<string | undefined>(undefined)
    prefix = input<string | undefined>(undefined)
    min = input<number>(0)
    max = input<number>(100)

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
