import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'button-demo',
    template: '<p-button label="Check" />',
    imports: [ButtonModule]
})
export class ButtonDemo {}