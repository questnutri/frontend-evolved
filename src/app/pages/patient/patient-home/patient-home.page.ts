import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DietPlanModel, PatientModel } from '@qn/models';
import { DietService, NotificationService, PatientService } from '@qn/services';
import { MealDisplayComponent } from "src/app/shared/components/core/qn-meal/qn-meal-display";

@Component({
    selector: 'app-patient-home',
    imports: [
        CommonModule,
        MealDisplayComponent
    ],
    templateUrl: './patient-home.page.html',
    styleUrl: './patient-home.page.scss',
})
export class PatientHomePage implements OnInit {
    private readonly patientService = inject(PatientService);
    private readonly dietService = inject(DietService);
    private readonly notificationService = inject(NotificationService);
    
    protected patient = signal<PatientModel | null>(null);
    protected dietPlan = signal<DietPlanModel | null>(null);
    protected fullDietData = signal<any>(null);
    protected todayMealPlans = signal<any[]>([]);
    protected selectedDate = signal<Date>(new Date());
    
    // Computed signals for progress tracking
    protected completedMeals = computed(() => {
        return this.todayMealPlans().filter(mp => 
            mp.mealRecords && mp.mealRecords.length > 0 && 
            mp.mealRecords.some((r: any) => r.isCompleted)
        ).length;
    });
    
    protected totalMeals = computed(() => this.todayMealPlans().length);
    
    protected progressPercentage = computed(() => {
        const total = this.totalMeals();
        if (total === 0) return 0;
        return Math.round((this.completedMeals() / total) * 100);
    });

    protected isToday = computed(() => {
        const selected = this.selectedDate();
        const today = new Date();
        return this.getDateString(selected) === this.getDateString(today);
    });

    protected formattedDate = computed(() => {
        const date = this.selectedDate();
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        return date.toLocaleDateString('pt-BR', options);
    });

    protected relativeDay = computed(() => {
        const selected = this.selectedDate();
        const today = new Date();
        const diffTime = this.getDateString(selected).localeCompare(this.getDateString(today));
        
        if (diffTime === 0) return 'Hoje';
        
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        if (this.getDateString(selected) === this.getDateString(yesterday)) return 'Ontem';
        
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        if (this.getDateString(selected) === this.getDateString(tomorrow)) return 'Amanhã';
        
        return null;
    });

    async ngOnInit() {
        try {
            this.patient.set(await this.patientService.getMe());
            await this.notificationService.me();
            await this.loadDietPlan();
        } catch (error) {
            console.error('Error loading patient data:', error);
        }
    }

    private async loadDietPlan() {
        try {
            const dietData = await this.dietService.getDietPlanForCurrent();
            if(dietData) {
                this.dietPlan.set(dietData.diet);
                this.fullDietData.set(dietData);
                this.updateMealPlansForSelectedDate();
            }
        } catch (error) {
            console.error('Error loading diet plan:', error);
        }
    }

    private updateMealPlansForSelectedDate() {
        const dietData = this.fullDietData();
        if (!dietData || !dietData.plan) return;

        const selectedStr = this.getDateString(this.selectedDate());
        
        const dayPlan = dietData.plan.find((p: any) => {
            const planDate = new Date(p.relativeDate);
            return this.getDateString(planDate) === selectedStr;
        });
        
        if (dayPlan && dayPlan.mealPlans) {
            this.todayMealPlans.set(dayPlan.mealPlans);
        } else {
            this.todayMealPlans.set([]);
        }
    }

    private getDateString(date: Date): string {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0];
    }

    protected goToPreviousDay(): void {
        const current = this.selectedDate();
        const newDate = new Date(current);
        newDate.setDate(current.getDate() - 1);
        this.selectedDate.set(newDate);
        this.updateMealPlansForSelectedDate();
    }

    protected goToNextDay(): void {
        const current = this.selectedDate();
        const newDate = new Date(current);
        newDate.setDate(current.getDate() + 1);
        this.selectedDate.set(newDate);
        this.updateMealPlansForSelectedDate();
    }

    protected goToToday(): void {
        this.selectedDate.set(new Date());
        this.updateMealPlansForSelectedDate();
    }

    protected onMealChecked(mealPlan: any, isChecked: boolean) {
        console.log('Meal checked:', mealPlan.meal.name, isChecked);
        
        if (isChecked && (!mealPlan.mealRecords || mealPlan.mealRecords.length === 0)) {
            mealPlan.mealRecords = [{
                id: `temp-${Date.now()}`,
                isCompleted: true,
                conclusionHour: new Date().toTimeString().split(' ')[0],
                createdAt: new Date().toISOString(),
            }];
        } else if (!isChecked && mealPlan.mealRecords && mealPlan.mealRecords.length > 0) {
            mealPlan.mealRecords = [];
        }
        
        this.todayMealPlans.set([...this.todayMealPlans()]);
    }
}