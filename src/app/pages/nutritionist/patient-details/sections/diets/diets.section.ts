import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { QnButtonComponent } from "@qn/components/basic";
import { DietModel } from '@qn/models';
import { DietService } from '@qn/services';
import { MealDisplayComponent } from "src/app/shared/components/core/qn-meal/qn-meal-display";
import { DietStatusPipe } from 'src/app/shared/pipes/diet-status-pipe';
import { ChipModule } from 'primeng/chip';
@Component({
    selector: 'app-nutritionist-patient-diets',
    templateUrl: './diets.section.html',
    styleUrls: ['./diets.section.scss'],
    imports: [QnButtonComponent, MealDisplayComponent, DietStatusPipe, ChipModule],
})
export class NutritionistPatientDietsSection implements OnInit {
    private readonly dietService = inject(DietService);
    patientId = input.required<string>();


    diets = signal<DietModel[]>([]);
    constructor() {
        effect(async () => {
            if (this.patientId()) {
                const patientDiets = await this.dietService.getDiets(this.patientId());
                this.diets.set(patientDiets);
                console.log('diets: ', patientDiets);

            }
        })
    }

    ngOnInit() {
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
