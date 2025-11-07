import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meal } from 'src/app/shared/interface/Meal.interface';

export interface MealCardState extends Meal {
    checked: boolean;
    expanded: boolean;
}

@Component({
    selector: 'app-meal-display',
    templateUrl: './qn-meal-display.html',
    styleUrls: ['./qn-meal-display.scss'],
    imports: [CommonModule, FormsModule],
    standalone: true
})
export class MealDisplayComponent {
    meal = input.required<MealCardState>();

    // Valores calculados
    totalCalories = computed(() => {
        return this.calculateTotal('kcal');
    });

    totalCarbs = computed(() => {
        return this.calculateTotal('carb');
    });

    totalProtein = computed(() => {
        return this.calculateTotal('protein');
    });

    totalFat = computed(() => {
        return this.calculateTotal('fat');
    });

    formattedTime = computed(() => {
        const hour24 = this.meal().hour;
        const [hours, minutes] = hour24.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${period}`;
    });

    private calculateTotal(nutrient: 'kcal' | 'carb' | 'protein' | 'fat'): number {
        let total = 0;

        this.meal().foods.forEach(food => {
            if (!food.isActive) return;

            const portion = food.aliment.portions[food.portion];
            if (!portion) return;

            const multiplier = parseFloat(food.quantity) || 1;
            total += this.parseValue(portion[nutrient]) * multiplier;
        });

        return total;
    }

    private parseValue(value: string): number {
        if (!value || value === 'NA' || value === 'Tr' || value === '') {
            return 0;
        }
        return parseFloat(value.replace(',', '.')) || 0;
    }

    toggleExpanded(meal: MealCardState): void {
        if (meal.foods.length > 0) {
            meal.expanded = !meal.expanded;
        }
    }

    toggleChecked(meal: MealCardState): void {
        meal.checked = !meal.checked;
    }
}