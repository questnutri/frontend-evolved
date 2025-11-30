import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DeviceService } from '@qn/services';
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

    meal = input.required<MealModel>();
    expanded = signal<boolean>(false);
    checked = signal<boolean>(false);
    Number = Number;
    food_expanded = signal<{ [key: string]: boolean }>({});

    ngOnInit(): void {
        console.log(this.meal());
    }

    isFoodVisible = (foodId: string) => computed(() => {
        const isMobile = this.deviceService.isMobileSize();

        if (!isMobile) return true;
        return this.food_expanded()[foodId] ?? false;
    })

    toggleExpanded(): void {
        if (this.meal().foods.length > 0) {
            this.expanded.update(value => !value);
        }
    }

    toggleChecked(): void {
        console.log('1- Toggling checked state', this.checked());

        this.checked.update(value => !value);
        console.log('2- Toggling checked state', this.checked());
    }

    toggleFoodExpanded(foodId: string) {
        this.food_expanded.update(prev => ({
            ...prev,
            [foodId]: !(prev[foodId] ?? false)  // garante que undefined = false
        }));
        console.log('Toggled food expanded for', foodId, this.food_expanded());
    }

}