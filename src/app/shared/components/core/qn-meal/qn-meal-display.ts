import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, computed, output, OnInit, effect, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, DeviceService, MealRecord, MealRecordService } from '@qn/services';
import { today } from 'ionicons/icons';
import { MealModel } from 'src/app/shared/models/meal.model';

@Component({
    selector: 'app-meal-display',
    templateUrl: './qn-meal-display.html',
    styleUrls: ['./qn-meal-display.scss'],
    imports: [CommonModule, FormsModule],
    standalone: true
})
export class MealDisplayComponent implements OnInit {
    readonly deviceService = inject(DeviceService);
    readonly authService = inject(AuthService);
    private readonly mealRecordService = inject(MealRecordService); 

    // Inputs
    meal = model.required<MealModel>();
    mealRecord = model<MealRecord>();
    isCompleted = input<boolean>(false);
    displayDate = input<Date | string | null>(null); // Add input for the displayed date
    relativeDate = input<Date>();

    treatedRelativeDate = computed(() => {
        const extractDate = (date: Date) => {
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();
            return `${year}-${month + 1}-${day}`;
        }
        const date = this.relativeDate();
        if (date) {
            return extractDate(date);
        }

        return extractDate(new Date());
    })


    // Output for checked state changes
    checkedChange = output<boolean>();

    // Component state
    expanded = signal<boolean>(false);
    checked = signal<boolean>(false);
    food_expanded = signal<{ [key: string]: boolean }>({});

    Number = Number;

    // Computed signal to determine if checkbox should be disabled
    isCheckboxDisabled = computed(() => {
        const userRole = this.authService.userRole();

        // If user is not a patient, checkbox is always disabled
        if (userRole !== 'patient') {
            return true;
        }

        // If user is a patient, check if the displayed date is today
        const displayDateValue = this.displayDate();
        if (!displayDateValue) {
            return false; // If no date provided, allow checking
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const compareDate = new Date(displayDateValue);
        compareDate.setHours(0, 0, 0, 0);

        // Disable if the date is NOT today
        return compareDate.getTime() !== today.getTime();
    });

    // Computed signal to check if relativeDate is today
    isRelativeDateToday = computed(() => {
        const relativeDate = this.relativeDate();
        if (!relativeDate) return true; // Default to true if no date provided
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const compareDate = new Date(relativeDate);
        compareDate.setHours(0, 0, 0, 0);
        
        return compareDate.getTime() === today.getTime();
    });

    // Effect to sync checked state with isCompleted input
    constructor() {
        effect(() => {
            this.checked.set(this.isCompleted());
            this.meal.update((meal: any) => MealModel.from({ ...meal }));
        });
    }

    async ngOnInit(): Promise<void> {
        const mealRecord = this.mealRecord();
        if(mealRecord && mealRecord.isCompleted) {
            this.checked.set(true);
        }
    }

    isFoodVisible = (foodId: string) => computed(() => {
        const isMobile = this.deviceService.isMobileSize();
        if (!isMobile) return true;
        return this.food_expanded()[foodId] ?? false;
    });

    toggleExpanded(): void {
        if (this.meal().foods.length > 0) {
            this.expanded.update(value => !value);
        }
    }

    async toggleChecked(): Promise<void> {
        // Prevent toggling if checkbox is disabled
        if (this.isCheckboxDisabled()) {
            return;
        }

        const newValue = !this.checked();
        await this.mealRecordService.createMealRecord(this.meal().id);
        this.checked.set(newValue);
        this.checkedChange.emit(newValue);
    }

    toggleFoodExpanded(foodId: string): void {
        this.food_expanded.update(prev => ({
            ...prev,
            [foodId]: !(prev[foodId] ?? false)
        }));
    }
}