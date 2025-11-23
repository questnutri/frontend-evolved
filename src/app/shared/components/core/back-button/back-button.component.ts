import { Component, input, output } from "@angular/core";

@Component({
    selector: 'app-back-button',
    templateUrl: './back-button.component.html',
    styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent {
    text = input<string>();
    onClick = output<void>();
    doOnClick() {
        this.onClick.emit();
    }
}