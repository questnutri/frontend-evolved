import { Directive, model, OnInit, output } from '@angular/core';
@Directive({})
export abstract class QnComponent implements OnInit {
    width = model<string | undefined>();
    cursor = model<string>('default');
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

}
