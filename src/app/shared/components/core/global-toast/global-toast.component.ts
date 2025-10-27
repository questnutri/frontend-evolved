import { Component, inject } from '@angular/core';
import { NotificationService } from '@qn/services';
import { MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
    selector: 'qn-global-toast',
    imports: [ToastModule],
    template: `
    <p-toast [style.width]="deviceService.isMobileSize() ? '90vw' : '400px'"
    [position]="deviceService.isMobileSize() ? 'bottom-right' : 'top-right'">
</p-toast>
    `,
    styles: ``,
    providers: [MessageService]
})
export class QnGlobalToastComponent {
    private readonly notificationService = inject(NotificationService);
    private readonly messageService = inject(MessageService);
    protected readonly deviceService = inject(DeviceService);

    constructor() {
        this.notificationService.notifications$.subscribe(message => {
            if (message) {
                this.messageService.add({...message});
            }
        });
    }
}
