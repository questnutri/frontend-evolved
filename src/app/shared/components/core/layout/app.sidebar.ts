import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    // styles: [`@use "../../../../app.scss" as *;`],
    template: ` <div class="layout-sidebar" [style.background]="'var(--primary-background-color)'">
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) { }
}
