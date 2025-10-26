import { Directive, model, OnInit, output } from '@angular/core';
@Directive({})
export abstract class QnComponent implements OnInit {
    width = model<string | undefined>();
    cursor = model<string>();
    isHovered = model<boolean>(false);
    onHover = output<void>();
    constructor() { }

    ngOnInit() { }

    onMouseEnter() {
        this.isHovered.set(true);
    }
    onMouseLeave() {
        this.isHovered.set(false);
    }

    doOnHover() {
        this.onHover.emit();
    }

    generateRandomId() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
}
