import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificationService } from '../../../services/notification/notification.service';
import { DeviceService } from '../../../services/device/device.service';
import { QnTextInputComponent } from '@qn/components/basic';
import { NutritionistService } from '@qn/services';
import { NutritionistModel } from 'src/app/shared/models/nutritionist.model';
import { DietService } from 'src/app/services/diet/diet.service';

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
    private readonly dietService = inject(DietService);
    private readonly deviceService = inject(DeviceService);
    nutritionist = signal<NutritionistModel | null>(null);

    async ngOnInit() {
        this.nutritionist.set(
            await this.nutritionistService.getMe()
        );
        const diet = await this.dietService.getDietById('ae14c43d-7c40-4679-a019-068553ee7a0a');
        console.log(diet);
        console.log(diet?.getTotal('kcal'));

        console.log(this.nutritionist());
    }

    testToast() {
        this.notificationService.add({ severity: 'success', summary: 'Success', detail: 'This is a success message' });
    }

}