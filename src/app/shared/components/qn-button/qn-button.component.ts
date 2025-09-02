import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
    selector: 'qn-button',
    templateUrl: './qn-button.component.html',
    styleUrls: ['./qn-button.component.scss'],
    imports: [
        CommonModule
    ],
})
export class QnButtonComponent {
    styles = input<any>({
        background: "var(--primary-color)"
    })
}