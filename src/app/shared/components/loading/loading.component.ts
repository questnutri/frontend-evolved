import { Component, computed, input, OnInit, signal } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
    selector: 'qn-loading',
    imports: [
        LottieComponent
    ],
    template: `
    <ng-lottie 
        [options]="options()"
        [width]="effectiveWidth()"
        [height]="effectiveHeight()"
    />`,
})
export class QnLoading {
    dark = input(false, { transform: (value: string | boolean) => value === '' || value === true });
    small = input(false, { transform: (value: string | boolean) => value === '' || value === true });
    medium = input(false, { transform: (value: string | boolean) => value === '' || value === true });
    large = input(false, { transform: (value: string | boolean) => value === '' || value === true });

    width = input<string>();
    height = input<string>();

    protected normalOpt = signal<AnimationOptions>({
        path: `/animations/qn-lottie.json`,
        autoplay: true,
        loop: true
    });

    protected darkOpt = signal<AnimationOptions>({
        path: `/animations/qn-lottie-dark.json`,
        autoplay: true,
        loop: true
    });

    protected options = computed(() => {
        return this.dark() ? this.darkOpt() : this.normalOpt();
    })

    private intrinsicWidth = computed(() => {
        if (this.small()) return "200px";
        if (this.medium()) return "400px";
        if (this.large()) return "600px";
        return null;
    });
    
    private intrinsicHeight = computed(() => {
        if (this.small()) return "200px";
        if (this.medium()) return "400px";
        if (this.large()) return "600px";
        return null;
    });

    protected readonly effectiveWidth = computed(() => {
        return this.width() || this.intrinsicWidth() || "1000px";
    });

    protected readonly effectiveHeight = computed(() => {
        return this.height() || this.intrinsicHeight() || "1000px";
    });
}