import { Component, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QnInput } from '@qn/components/abstracts/qn-input.abstract';
import { InputTextModule } from 'primeng/inputtext';
import { QnDiv } from "@qn/components/basic";
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';

@Component({
    selector: 'qn-text-input',
    templateUrl: './qn-text-input.component.html',
    styleUrls: ['./qn-text-input.component.scss'],
    imports: [
        InputTextModule,
        FormsModule,
        QnDiv,
        InputIcon,
        IconField
    ]
})
export class QnTextInputComponent extends QnInput<string> implements OnInit {
    type = input<"text" | "email">('text');
    override id = this.generateRandomId({ prefix: 'text-input-' });
    icon = input<string | null>(null);
}