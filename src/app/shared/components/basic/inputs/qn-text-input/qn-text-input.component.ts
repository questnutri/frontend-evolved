import { Component, input, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { QnInput } from '@qn/components/abstracts/qn-input.abstract';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';

@Component({
    selector: 'qn-text-input',
    templateUrl: './qn-text-input.component.html',
    styleUrls: ['./qn-text-input.component.scss'],
    imports: [
        InputTextModule,
        FormsModule
    ]
})
export class QnTextInputComponent extends QnInput<string> implements OnInit {
    type = input<"text" | "email">('text');
    override id = this.generateRandomId({ prefix: 'text-input-' });
}