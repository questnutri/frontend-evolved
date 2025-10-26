import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../services/notification/notification.service';
import { DeviceService } from '../../../services/device/device.service';
import { QnTextInputComponent } from '@qn/components';

@Component({
    selector: 'app-nutritionist-home',
    imports: [
        
    ],
    templateUrl: './nutritionist-home.page.html',
    styleUrl: './nutritionist-home.page.scss'
})
export class NutritionistHomePage {
    private readonly notificationService = inject(NotificationService);
    private readonly deviceService = inject(DeviceService);

    testToast() {
        this.notificationService.add({ severity: 'success', summary: 'Success', detail: 'This is a success message' });
    }

}