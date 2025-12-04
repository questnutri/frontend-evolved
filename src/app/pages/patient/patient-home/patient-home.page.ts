import { Component, inject, OnInit, signal } from '@angular/core';
import { DietPlanModel, PatientModel } from '@qn/models';
import { NotificationService, PatientService } from '@qn/services';
import { MealDisplayComponent } from "src/app/shared/components/core/qn-meal/qn-meal-display";

@Component({
    selector: 'app-patient-home',
    imports: [
        MealDisplayComponent
    ],
    templateUrl: './patient-home.page.html',
    styleUrl: './patient-home.page.scss',
})
export class PatientHomePage implements OnInit{
    private readonly patientService = inject(PatientService);
    private readonly notificationService = inject(NotificationService);
    protected patient = signal<PatientModel | null>(null);
    protected dietPlan = signal<DietPlanModel | null>(null);

    async ngOnInit() {
        this.patient.set(
            await this.patientService.getMe()
        );
        await this.notificationService.me();
    }
}