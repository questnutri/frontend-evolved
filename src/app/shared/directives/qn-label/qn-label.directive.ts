import { AfterViewInit, computed, Directive, ElementRef, input, Renderer2, ViewContainerRef } from "@angular/core";
import { QnLabelComponent } from "@qn/components/basic";
import { ComponentKeys } from "src/app/shared/types/component-keys";

@Directive({
    selector: "[qnLabel],[qnLabel-white]",
    standalone: true,
})
export class QnLabelDirective implements AfterViewInit {
    qnLabel = input<string>();
    qnLabelWhite = input<string>('', { alias: 'qnLabel-white' });
    qnLabelStyle = input<Partial<ComponentKeys<QnLabelComponent, 'value'>>>();

    private effectiveLabelValue = computed(() => {
        const whiteValue = this.qnLabelWhite()?.trim();
        if (whiteValue?.length === 0) {
            const defaultValue = this.qnLabel()?.trim();
            if (defaultValue?.length === 0) {
                return ''
            }
            return defaultValue;
        }
        return whiteValue;
    })

    private effectiveLabelColor = computed(() => {
        const white = this.qnLabelWhite();
        if (white && white.length > 0) {
            return "#fff";
        }
        return "#000";
    })

    constructor(
        private el: ElementRef<HTMLElement>,
        private renderer: Renderer2,
        private vcr: ViewContainerRef
    ) { }

    ngAfterViewInit(): void {
        console.log(this.qnLabelWhite());

        const targetElement = this.el.nativeElement;
        const parent = targetElement.parentNode;
        if (!parent) return;

        const divWrapper = this.renderer.createElement("qn-div");
        this.renderer.setAttribute(divWrapper, "flex-column", "");

        this.renderer.insertBefore(parent, divWrapper, targetElement);

        try {
            const labelComponent = this.vcr.createComponent(QnLabelComponent);
            labelComponent.setInput("value", this.effectiveLabelValue());
            labelComponent.setInput("color", this.effectiveLabelColor());
            labelComponent.setInput("size", this.qnLabelStyle()?.size);
            labelComponent.setInput("weight", this.qnLabelStyle()?.weight);

            const labelHtmlElement = labelComponent.location.nativeElement as HTMLElement;
            this.renderer.appendChild(divWrapper, labelHtmlElement);
            this.renderer.appendChild(divWrapper, targetElement);
        } catch (e) {
            const labelEl = this.renderer.createElement("qn-label");
            this.renderer.setAttribute(labelEl, "text", String((this.qnLabel as any)?.() ?? ""));
            this.renderer.appendChild(divWrapper, labelEl);
            this.renderer.appendChild(divWrapper, targetElement);
        }
    }
}
