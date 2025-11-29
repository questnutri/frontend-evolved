import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DietPlanModel } from '@qn/models';
import { DietService } from '@qn/services';
import { DatePickerModule } from 'primeng/datepicker';
import { BackButtonComponent } from "src/app/shared/components/core/back-button/back-button.component";
import { MealDisplayComponent } from "src/app/shared/components/core/qn-meal/qn-meal-display";
import { Button } from "primeng/button";

@Component({
    selector: 'app-diet-details',
    templateUrl: './diet-details.component.html',
    styleUrls: ['./diet-details.component.scss'],
    imports: [
        BackButtonComponent,
        DatePickerModule,
        FormsModule,
        MealDisplayComponent,
        Button
    ],
})
export class PatientDietDetailsPage {
    private readonly router = inject(Router);
    private readonly dietService = inject(DietService);
    private readonly activatedRoute = inject(ActivatedRoute);

    patientId = input.required<string>();
    dietId = input.required<string>();

    timezone = signal<number | null>(null);
    date = signal<Date | null>(null);
    dietPlan = signal<DietPlanModel | null>(null);

    private initialLoad = true;

    private currentMonthYear = signal<{ month: number; year: number } | null>({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });

    constructor() {
        this.activatedRoute.queryParamMap.subscribe(params => {
            let date = params.get('date');
            let tz = params.get('timezone');

            if (!tz) {
                const browserOffset = -new Date().getTimezoneOffset() / 60;
                tz = String(browserOffset);
                this.timezone.set(browserOffset);
                this.router.navigate([], {
                    queryParams: { date, timezone: tz },
                    queryParamsHandling: 'merge'
                });
                return;
            }

            const offset = Number(tz);
            this.timezone.set(offset);

            if (!date) {
                const todayStr = this.getTodayFromTimezone(offset);
                this.router.navigate([], {
                    queryParams: { date: todayStr, timezone: tz },
                    queryParamsHandling: 'merge'
                });
                return;
            }

            const [y, m, d] = date.split('-').map(Number);
            const utcBase = new Date(Date.UTC(y, m - 1, d));
            const finalDate = new Date(utcBase.getTime() - offset * 3600000);
            this.date.set(finalDate);

            this.currentMonthYear.set({ year: y, month: m });

            this.initialLoad = false;
        });

        effect(async () => {
            const fetchRelativeDate = this.currentMonthFirstDay();
            if (fetchRelativeDate) {
                const response = await this.dietService.getDietPlan(
                    this.dietId(),
                    fetchRelativeDate
                );
                if (this.dietPlan()) {
                    this.dietPlan()!.merge(DietPlanModel.from(response));
                } else {
                    this.dietPlan.set(DietPlanModel.from(response));
                }
            }
        });

        effect(() => {
            const current = this.date();
            const tz = this.timezone();
            if (!current || this.initialLoad || tz === null) return;

            const y = current.getFullYear();
            const m = current.getMonth() + 1;
            const d = current.getDate();
            const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

            this.router.navigate([], {
                queryParams: { date: dateStr, timezone: tz },
                queryParamsHandling: 'merge'
            });
        });
    }

    private getTodayFromTimezone(offset: number): string {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const tzTime = new Date(utc + offset * 3600000);
        const y = tzTime.getFullYear();
        const m = tzTime.getMonth() + 1;
        const d = tzTime.getDate();
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    protected mealsDietRelativeDate = computed(() => {
        if (!this.dietPlan() || !this.date()) return [];
        const foundPlan = this.dietPlan()!.plan.find(day => {
            return this.date()!.toISOString().split("T")[0] === day.relativeDate.split("T")[0];
        });
        return foundPlan?.mealPlans.map(mp => mp.meal) || [];
    });

    protected currentMonthFirstDay = computed(() => {
        if (!this.currentMonthYear()) return null;
        return new Date(this.currentMonthYear()!.year, this.currentMonthYear()!.month - 1, 1);
    });

    protected dateFormat = computed(() => {
        const date = this.date();
        if (!date) return '';
        const formatted = date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
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

    goToToday() {
        const offset = this.timezone();
        if (offset === null) return;

        const todayStr = this.getTodayFromTimezone(offset);
        const [y, m, d] = todayStr.split('-').map(Number);
        const finalDate = new Date(Date.UTC(y, m - 1, d) - offset * 3600000);

        this.date.set(finalDate);
        this.currentMonthYear.set({ year: y, month: m });

        this.router.navigate([], {
            queryParams: { date: todayStr, timezone: offset },
            queryParamsHandling: 'merge'
        });
    }

    doOnMonthChange(event: any) {
        this.currentMonthYear.set({
            year: event.year,
            month: event.month
        });
    }
}
