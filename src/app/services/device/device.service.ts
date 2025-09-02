import { inject, Injectable, signal } from "@angular/core";
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    private platform = inject(Platform);
    public readonly isMobileSize = signal<boolean>(false);
    private MOBILE_WIDTH = 768;

    constructor() {
        this.checkScreenSize();
        this.platform.resize.subscribe(() => {
            this.checkScreenSize();
        })
    }

    private checkScreenSize() {
        this.isMobileSize.set(this.platform.width() < this.MOBILE_WIDTH);
    }


}