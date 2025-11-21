import { Component, inject, OnInit, signal } from '@angular/core';
import { NutritionistService } from '@qn/services';
import { DietService } from 'src/app/services/diet/diet.service';
import { MealModel } from 'src/app/shared/models/meal.model';
import { NutritionistModel } from 'src/app/shared/models/nutritionist.model';
import { DeviceService } from '../../../services/device/device.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { MealDisplayComponent } from 'src/app/shared/components/core/qn-meal/qn-meal-display';
import { DietModel } from 'src/app/shared/models/diet.model';

@Component({
    selector: 'app-nutritionist-home',
    imports: [
        MealDisplayComponent
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
    diets = signal<DietModel | null>(null);

    async ngOnInit() {
        this.nutritionist.set(
            await this.nutritionistService.getMe()
        );
        const diet = await this.dietService.getDietById('402e3b50-b38f-465d-b147-1e11ac791f2a');
        this.diets.set(diet);
        // console.log(diet!.meals[0].foods[0]);
        // console.log(diet!.meals[0].foods[0].getTotal('kcal'));
        // console.log(diet?.getTotal('kcal'));

        console.log(this.nutritionist());
    }

    testToast() {
        this.notificationService.add({ severity: 'success', summary: 'Success', detail: 'This is a success message' });
    }

}