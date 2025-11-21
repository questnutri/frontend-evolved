import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Patient } from '@qn/models';
import { PatientService } from '@qn/services';

@Component({
    selector: 'nutritionist-patient-details',
    templateUrl: './nutritionist-patient-details.page.html',
    styleUrls: ['./nutritionist-patient-details.page.scss'],
})
export class NutritionistPatientDetailsPage implements OnInit {
    private readonly patientService = inject(PatientService);
    private readonly route = inject(ActivatedRoute);
    patientId = input.required<string>();
    patient = signal<Patient | null>(null); // ou crie uma interface Patient

    constructor() { }

    async ngOnInit() {

        if (this.patientId()) {
            const patientData = await this.patientService.getById(this.patientId());
            this.patient.set(patientData);
        }
    }


}