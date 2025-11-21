import { Component, computed, input, OnInit } from '@angular/core';
import { QnButtonComponent } from "@qn/components/basic";
import { DietModel } from '@qn/models';
import { MealDisplayComponent } from "src/app/shared/components/core/qn-meal/qn-meal-display";

@Component({
    selector: 'app-nutritionist-patient-diets',
    templateUrl: './nutritionist-patient-diets.page.html',
    styleUrls: ['./nutritionist-patient-diets.page.scss'],
    imports: [QnButtonComponent, MealDisplayComponent],
})
export class NutritionistPatientDietsPage implements OnInit {

    diets = input<DietModel[]>();
    constructor() { }

    ngOnInit() {
        console.log(this.diets());

    }

    dateFormat(date: Date | undefined): string {
        if (!date) {
            return '';
        }
        if (date instanceof Date === false) {
            date = new Date(date);
        }
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

}
