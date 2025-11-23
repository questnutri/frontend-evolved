import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { QnComponent } from '@qn/components/abstracts/qn-component.abstract';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'qn-button',
    templateUrl: './qn-button.component.html',
    styleUrls: ['./qn-button.component.scss'],
    imports: [
        CommonModule,
        ButtonModule
    ],
})
export class QnButtonComponent extends QnComponent {

    label = input.required<string>()
    colorStyle = input<'blue' | 'gray' | 'white'>('blue')
    widthDiv = input<string>('100%')
    disabled = input<boolean>(false)
    loading = input<boolean>(false)
    icon = input<string>();
    style = input<{ [klass: string]: any } | undefined>();
    click = output<Event>();

    colorButton = computed(() => {
        if (this.colorStyle() === 'blue') return 'primary';
        if (this.colorStyle() === 'gray') return 'secondary';
        return 'info';
    })

    buttonStyle = computed(() => {
        const baseStyle = {
            width: this.width(),
            fontWeight: '600',
            border: 'none',
            ...this.style(),
        };

        return baseStyle

    });
    divStyle = computed(() => {
        const divStyle = {
            display: 'flex',
            justifyContent: 'center',
            width: this.widthDiv(),
            ...this.style(),
        };

        return divStyle

    });

    handleClick(event: Event) {
        if (!this.disabled()) this.click.emit(event);
    }
}