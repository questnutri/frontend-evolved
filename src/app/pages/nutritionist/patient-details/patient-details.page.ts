import { Component, effect, inject, input, signal } from '@angular/core';
import { DietModel, Patient } from '@qn/models';
import { PatientService } from '@qn/services';
import { NutritionistPatientDetailsNavigation } from './navigation/navigation.navigation';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'nutritionist-patient-details',
    templateUrl: './patient-details.page.html',
    styleUrls: ['./patient-details.page.scss'],
    imports: [
        RouterOutlet,
        NutritionistPatientDetailsNavigation,
    ],
})
export class NutritionistPatientDetailsPage {
    private readonly patientService = inject(PatientService);
    patientId = input.required<string>();
    patient = signal<Patient | null>(null);

    patientDiets = signal<DietModel[]>([]);

    constructor() {
        effect(async () => {
            if (this.patientId()) {
                const patientData = await this.patientService.getById(this.patientId());
                this.patient.set(patientData);
            }
        })
    }

}