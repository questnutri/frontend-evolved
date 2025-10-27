import { Component, input, computed } from '@angular/core';
import { QnComponent } from '@qn/components/abstracts/qn-component.abstract';

@Component({
    selector: 'qn-div',
    imports: [],
    templateUrl: './qn-div.html',
    styleUrl: './qn-div.scss'
})
export class QnDiv extends QnComponent {
    //Display settings
    flex = input(false, { transform: (value: string | boolean) => value === '' || value === true });
    'flex-column' = input(false, { transform: (value: string | boolean) => value === '' || value === true });
    'flex-wrap' = input(false, { transform: (value: string | boolean) => value === '' || value === true });
    grid = input(false, { transform: (value: string | boolean) => value === '' || value === true });
    gap = input<string | number | null>(null);
    overflow = input<null | { x?: string, y?: string } | string>(null);
    boxSizing = input<string | null>(null);
    columns = input<string | number | null>(null);
    rows = input<string | number | null>(null);

    //Size settings
    fillX = input(false, { transform: (value: string | boolean) => value === '' || value === true });
    fillY = input(false, { transform: (value: string | boolean) => value === '' || value === true });
    fill = input(false, { transform: (value: string | boolean) => value === '' || value === true });

    minWidth = input<string>();
    maxWidth = input<string>();

    height = input<string>();
    minHeight = input<string>();
    maxHeight = input<string>();

    //Align settings
    center = input(false, { transform: (value: string | boolean) => value === '' || value === true });

    alignItems = input<string>();
    alignContent = input<string>();

    justifyContent = input<string>();
    justifyItems = input<string>();

    textAlign = input<string | null>(null);

    //Display settings
    padding = input<string>();
    paddingTop = input<string>();
    paddingRight = input<string>();
    paddingBottom = input<string>();
    paddingLeft = input<string>();
    paddingY = input<string>();
    paddingX = input<string>();

    margin = input<string>();
    marginTop = input<string>();
    marginRight = input<string>();
    marginBottom = input<string>();
    marginLeft = input<string>();
    marginY = input<string>();
    marginX = input<string>();

    position = input<string>();

    radius = input<string>();

    top = input<string>();
    right = input<string>();
    left = input<string>();
    bottom = input<string>();

    //Style settings
    color = input<string>(); //this is always background color
    shadow = input<string>();
    transition = input<string>();
    border = input<string>();

    effectiveDisplay = computed(() => {
        if (this.flex() || this['flex-column']() || this['flex-wrap']()) {
            return 'flex';
        }
        if (this.grid()) {
            return 'grid';
        }
        return 'block';
    });

    effectiveFlexDirection = computed(() => {
        if (this['flex-column']()) {
            return 'column';
        }
        return 'row';
    });

    effectiveOverflow = computed(() => {
        const overflow = this.overflow();
        if (overflow == null) {
            return null;
        }
        if (typeof overflow === 'string') {
            return overflow;
        }
        let result = '';
        if (overflow.x != null) {
            result += `overflow-x: ${overflow.x}; `;
        }
        if (overflow.y != null) {
            result += `overflow-y: ${overflow.y}; `;
        }
        return result.trim();
    });

    effectivePadding = computed(() => {
        const base = this.padding();
        if (base !== undefined) return base;
        const defaultValue = '0px';
        const top = this.paddingTop() || this.paddingY() || defaultValue;
        const right = this.paddingRight() || this.paddingX() || defaultValue;
        const bottom = this.paddingBottom() || this.paddingY() || defaultValue;
        const left = this.paddingLeft() || this.paddingX() || defaultValue;
        return `${top} ${right} ${bottom} ${left}`;
    })

    effectiveMargin = computed(() => {
        const base = this.margin();
        if (base !== undefined) return base;
        const defaultValue = '0px';
        const top = this.marginTop() || this.marginY() || defaultValue;
        const right = this.marginRight() || this.marginX() || defaultValue;
        const bottom = this.marginBottom() || this.marginY() || defaultValue;
        const left = this.marginLeft() || this.marginX() || defaultValue;
        return `${top} ${right} ${bottom} ${left}`;
    })

    effectiveAlignItems = computed(() => {
        if (this.center()) {
            return 'center';
        }
        return this.alignItems();
    });

    effectiveAlignContent = computed(() => {
        if (this.center()) {
            return 'center';
        }
        return this.alignContent();
    });

    effectiveJustifyItems = computed(() => {
        if (this.center()) {
            return 'center';
        }
        return this.justifyItems();
    });

    effectiveJustifyContent = computed(() => {
        if (this.center()) {
            return 'center';
        }
        return this.justifyContent();
    });



    protected overflowX = computed(() => {
        const overflow = this.overflow();
        return typeof overflow === 'string' ? overflow : overflow?.x;
    })

    protected overflowY = computed(() => {
        const overflow = this.overflow();
        return typeof overflow === 'string' ? overflow : overflow?.y;
    })
}