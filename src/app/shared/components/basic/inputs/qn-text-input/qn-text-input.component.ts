import { Component, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QnInput } from '@qn/components/abstracts/qn-input.abstract';
import { InputTextModule } from 'primeng/inputtext';
import { QnDiv } from "@qn/components/basic";

@Component({
    selector: 'qn-text-input',
    templateUrl: './qn-text-input.component.html',
    styleUrls: ['./qn-text-input.component.scss'],
    imports: [
        InputTextModule,
        FormsModule,
        QnDiv
    ]
})
export class QnTextInputComponent extends QnInput<string> implements OnInit {
    type = input<"text" | "email">('text');
    override id = this.generateRandomId({ prefix: 'text-input-' });
}