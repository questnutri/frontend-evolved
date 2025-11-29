import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DietPlan } from '@qn/interfaces';
import { DietModel, DietPlanModel, MealModel } from '@qn/models';
import { DietService } from '@qn/services';
import { DatePickerModule } from 'primeng/datepicker';
import { BackButtonComponent } from "src/app/shared/components/core/back-button/back-button.component";
import { MealDisplayComponent } from "src/app/shared/components/core/qn-meal/qn-meal-display";
@Component({
    selector: 'app-diet-details',
    templateUrl: './diet-details.component.html',
    styleUrls: ['./diet-details.component.scss'],
    imports: [
        BackButtonComponent,
        DatePickerModule,
        FormsModule,
        MealDisplayComponent
    ],
})
export class PatientDietDetailsPage {
    private readonly router = inject(Router);
    private readonly dietService = inject(DietService);
    private currentMonthYear = signal<{ month: number, year: number } | null>({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    patientId = input.required<string>();
    date = signal<Date>(new Date());
    dietPlan = signal<DietPlan | null>(null);
    dietId = input.required<string>();

    constructor() {
        effect(async () => {
            const fetchRelativeDate = this.currentMonthFirstDay();

            if (fetchRelativeDate) {
                const response = await this.dietService.getDietPlan(
                    this.dietId(),
                    fetchRelativeDate
                );

                console.log(response);


                this.dietPlan.set(DietPlanModel.from(response));
                console.log(this.dietPlan());

            }
        })
    }

    protected mealsDietRelativeDate = computed(() => {
        if (!this.dietPlan()) return [];

        const foundPlan = this.dietPlan()!.plan.find((day) => {
            return this.date().toISOString().split("T")[0] === day.relativeDate.split("T")[0];
        });

        return foundPlan?.mealPlans.map(mp => mp.meal) || [];
    })

    protected currentMonthFirstDay = computed(() => {
        if (!this.currentMonthYear()) return null;

        return new Date(this.currentMonthYear()!.year, this.currentMonthYear()!.month - 1, 1);
    })


    protected dateFormat = computed(() => {
        const date = this.date();
        const formatted = date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

        // Capitalizar a primeira letra de cada palavra
        return formatted
            .split(" ")
            .map(p => p.charAt(0).toUpperCase() + p.slice(1))
            .join(" ");
    });

    dateFormatPtBr(date: string | Date | undefined) {
        if (!date) return '';

        if (typeof date !== 'string') {
            date = date.toISOString();
        }
        const [year, month, day] = date.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    }

    goBackToPatient() {
        this.router.navigate(['/nutritionist', 'patient', this.patientId(), 'diets']);
    }

    doOnMonthChange(event: any) {
        this.currentMonthYear.set({
            year: event.year,
            month: event.month
        });

    }

    //TODO: DAY CONTROL BASED ON URL QUERY PARAMS - WHEN ENTER THE PAGE DATE = QUERYPARAM (NGONINIT) - WHEN CHANGE DATE IT UPDATES THE QUERY PARAM (EFFECT)
}
