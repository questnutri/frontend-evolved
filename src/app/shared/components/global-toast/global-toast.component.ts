import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";
import { NotificationService } from '../../../services/notification/notification.service';
import { DeviceService } from 'src/app/services/device/device.service';

@Component({
    selector: 'app-global-toast',
    imports: [ToastModule],
    templateUrl: './global-toast.component.html',
    styleUrl: './global-toast.component.scss',
    providers: [MessageService]
})
export class GlobalToastComponent {
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
