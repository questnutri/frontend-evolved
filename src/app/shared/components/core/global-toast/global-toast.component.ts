import { Component, inject } from '@angular/core';
import { NotificationService } from '@qn/services';
import { MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";
import { DeviceService } from 'src/app/services/device/device.service';
import { Button } from "primeng/button";

@Component({
    selector: 'qn-global-toast',
    imports: [ToastModule, Button],
    templateUrl: `./global-toast.component.html`,
    styleUrls: ['./global-toast.component.scss'],
    providers: [MessageService]
})
export class QnGlobalToastComponent {
    private readonly notificationService = inject(NotificationService);
    private readonly messageService = inject(MessageService);
    protected readonly deviceService = inject(DeviceService);

    constructor() {
        this.notificationService.notifications$.subscribe(message => {
            if (message) {
                this.messageService.add({ ...message });
            }
        });
    }
}