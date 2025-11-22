import { Component, input, model, ModelSignal } from "@angular/core";
import { QnComponent } from "@qn/components/abstracts/qn-component.abstract";

@Component({
    selector: 'qn-label',
    template: `<span
        [style.fontSize]="size() || DEFAULT_STYLES.size"
        [style.color]="color() || DEFAULT_STYLES.color"
        [style.fontWeight]="weight() || DEFAULT_STYLES.weight"
        [style.cursor]="cursor()"
    >{{ value() }}</span>`,
})
export class QnLabelComponent extends QnComponent {
    DEFAULT_STYLES = {
        size: '12px',
        color: '#fff',
        weight: '500'
    }

    value = input<string>('');
    size = input<string>(this.DEFAULT_STYLES.size);
    color = input<string>(this.DEFAULT_STYLES.color);
    weight = input<string>(this.DEFAULT_STYLES.weight);

    override cursor = model<any>("default");
}