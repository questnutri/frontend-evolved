import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DietPlanModel, MealModel } from '@qn/models';
import { DeviceService, DietService, PatientService } from '@qn/services';
import { ChipModule } from 'primeng/chip';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { MealDisplayComponent } from "src/app/shared/components/core/qn-meal/qn-meal-display";
import { PatientDietDetailsHeaderSection } from "./sections/header/header.section";
import { MealPanelSection } from "./sections/meal-panel/meal-panel.section";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-patient-diet-details',
    templateUrl: './diet-details.page.html',
    styleUrls: ['./diet-details.page.scss'],
    imports: [
        DatePickerModule,
        FormsModule,
        MealDisplayComponent,
        ChipModule,
        PatientDietDetailsHeaderSection,
        TooltipModule,
        SelectModule,
        MealPanelSection,
        CommonModule
    ],
})
export class PatientDietDetailsPage {
    private readonly dietService = inject(DietService);
    private readonly patientService = inject(PatientService);
    protected readonly deviceService = inject(DeviceService);
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);

    private currentMonthYear = signal<{ month: number, year: number } | null>({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    private initialLoad = true;
    private updatingDateSafely = false;

    patientId = input.required<string>();
    date = signal<Date>(new Date());
    dietPlan = signal<DietPlanModel | null>(null);
    dietId = input.required<string>();
    timezone = signal<number | null>(null);
    isMobile = this.deviceService.isMobileSize();
    weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    selectedDays = signal<number[]>([]);
    interval = signal<number>(1);
    selectedDates: Date[] = [];
    valueRepeat = signal<string>('once');

    // Novos signals
    // isEditingMeal = signal<boolean>(false);
    isCalendarVisible = signal<boolean>(true);
    editingMeal = signal<MealModel | null>(null);

    changeRepeatConfiguration(event: any) {
        this.valueRepeat.set(event.value);
    }

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
                this.dietPlan.set(DietPlanModel.from(response));
            }
        });

        effect(() => {
            const current = this.date();
            const tz = this.timezone();
            const plan = this.dietPlan();

            if (!current || this.initialLoad || tz === null || !plan) return;

            const start = new Date(plan.diet.startDate);
            const end = plan.diet.endDate ? new Date(plan.diet.endDate) : new Date(plan.diet.startDate);

            const clamped = this.clampDate(current, start, end);

            if (clamped.getTime() !== current.getTime()) {
                if (this.updatingDateSafely) return;
                this.updatingDateSafely = true;
                this.date.set(clamped);
                this.updatingDateSafely = false;
                return;
            }

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

    private clampDate(date: Date, start: Date, end: Date): Date {
        if (date < start) return start;
        if (date > end) return end;
        return date;
    }

    protected mealsDietRelativeDate = computed(() => {
        if (!this.dietPlan()) return [];

        const d = this.date();
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');

        const compareDay = `${year}-${month}-${day}`;

        const foundPlan = this.dietPlan()!.plan.find((day) => {
            return compareDay === day.relativeDate.split("T")[0];
        });

        return foundPlan?.mealPlans.map(mp => mp.meal) || [];
    });

    protected currentMonthFirstDay = computed(() => {
        if (!this.currentMonthYear()) return null;
        return new Date(this.currentMonthYear()!.year, this.currentMonthYear()!.month - 1, 1);
    });

    protected dateFormat = computed(() => {
        const date = this.date();

        const formatted = date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

        const parts = formatted.split(' ');

        const filtered = parts.filter(part => part.toLowerCase() !== 'de');

        const capitalized = filtered.map(part =>
            part.charAt(0).toUpperCase() + part.slice(1)
        );

        return capitalized.join(' ');
    });

    protected totalKcalMealsRelativeDate = computed(() => {
        const total = this.mealsDietRelativeDate().reduce((acc, meal) => acc + meal.getTotal('kcal'), 0);
        return Math.ceil(total);
    });

    protected dietStartDate = computed(() => {
        const diet = this.dietPlan()?.diet;
        if (diet) {
            return new Date(diet.startDate);
        } else {
            return null;
        }
    });

    protected dietEndDate = computed(() => {
        const diet = this.dietPlan()?.diet;
        if (diet && diet.endDate) {
            return new Date(diet.endDate);
        } else {
            return null;
        }
    });

    private getTodayFromTimezone(offset: number): string {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const tzTime = new Date(utc + offset * 3600000);
        const y = tzTime.getFullYear();
        const m = tzTime.getMonth() + 1;
        const d = tzTime.getDate();
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }

    dateFormatPtBr(date: string | Date | undefined) {
        if (!date) return '';

        if (typeof date !== 'string') {
            date = date.toISOString();
        }
        const [year, month, day] = date.split('T')[0].split('-');
        return `${day}/${month}/${year}`;
    }

    doOnMonthChange(event: any) {
        this.currentMonthYear.set({
            year: event.year,
            month: event.month
        });
    }

    async refreshDietPlan() {
        const date = this.currentMonthFirstDay();
        if (date) {
            const response = await this.dietService.getDietPlan(this.dietId(), date);
            this.dietPlan.set(DietPlanModel.from(response));
        }
    }

    toggleDay(dayIndex: number) {
        this.selectedDays.update(days => {
            if (days.includes(dayIndex)) {
                return days.filter(d => d !== dayIndex);
            } else {
                return [...days, dayIndex].sort((a, b) => a - b);
            }
        });
    }

    textFrequency = computed(() => {

        if (this.valueRepeat() === 'daily') {
            return {
                value1: 'Repetir a cada',
                value2: `dia(s)`
            }
        } else if (this.valueRepeat() === 'weekly') {
            return {
                value1: 'Acontece a cada',
                value2: `semana(s)`
            }
        } else if (this.valueRepeat() === 'monthly') {
            return {
                value1: 'Acontece a cada',
                value2: `mês(es)`
            }
        } else {
            return {
                value1: '',
                value2: ''
            }
        }
    });

    toggleCalendar() {
        this.isCalendarVisible.update(v => !v);
    }

    openEditMeal(meal: MealModel) {
        this.editingMeal.set(meal);
        this.isCalendarVisible.set(false);
    }

    closeEditMeal() {
        this.editingMeal.set(null);
    }
}