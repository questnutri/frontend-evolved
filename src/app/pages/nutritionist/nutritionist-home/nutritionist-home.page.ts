import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificationService } from '../../../services/notification/notification.service';
import { DeviceService } from '../../../services/device/device.service';
import { QnTextInputComponent } from '@qn/components/basic';
import { NutritionistService } from '@qn/services';
import { NutritionistModel } from 'src/app/shared/models/nutritionist.model';

@Component({
    selector: 'app-nutritionist-home',
    imports: [
        
    ],
    templateUrl: './nutritionist-home.page.html',
    styleUrl: './nutritionist-home.page.scss'
})
export class NutritionistHomePage implements OnInit {
    private readonly nutritionistService = inject(NutritionistService);
    private readonly notificationService = inject(NotificationService);
    private readonly deviceService = inject(DeviceService);
    nutritionist = signal<NutritionistModel | null>(null);

    async ngOnInit() {
        this.nutritionist.set(
            await this.nutritionistService.getMe()
        );
        console.log(this.nutritionist());
    }

    testToast() {
        this.notificationService.add({ severity: 'success', summary: 'Success', detail: 'This is a success message' });
    }

}