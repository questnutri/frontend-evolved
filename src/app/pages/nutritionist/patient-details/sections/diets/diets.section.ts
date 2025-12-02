import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { QnButtonComponent, QnTextInputComponent } from "@qn/components/basic";
import { DietModel } from '@qn/models';
import { DietService } from '@qn/services';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DietStatusPipe } from 'src/app/shared/pipes/diet-status-pipe';
import { DatePicker } from "primeng/datepicker";
@Component({
    selector: 'app-nutritionist-patient-diets',
    templateUrl: './diets.section.html',
    styleUrls: ['./diets.section.scss'],
    imports: [QnButtonComponent, DietStatusPipe, ChipModule, DialogModule, QnTextInputComponent, DatePicker],
})
export class NutritionistPatientDietsSection {
    private readonly router = inject(Router);
    private readonly dietService = inject(DietService);
    patientId = input.required<string>();

    visible = signal<boolean>(false);

    showModalNewDiet() {
        this.visible.set(true);
    }


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

    doOnSeeDiet(dietId: string) {
        this.router.navigate(['/nutritionist/patient', this.patientId(), 'diet', dietId]);
    }

}
