import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { Patient } from '@qn/models';
import { PatientService } from '@qn/services';

@Component({
    selector: 'app-nutritionist-patient-info',
    templateUrl: './info.section.html',
    styleUrls: ['./info.section.scss'],
})
export class NutritionistPatientInfoSection {
    patientId = input.required<string>();
    protected patient = signal<Patient | null>(null);
    private readonly patientService = inject(PatientService);

    constructor() {
        effect(async () => {
            if (this.patientId()) {
                const foundPatient = await this.patientService.getById(this.patientId());
                this.patient.set(foundPatient);
            }
        })
    }

    infoSections = [
        {
            mainLabel: 'Dados Pessoais',
            details: [
                { label: 'Nome', value: () => this.patient()?.name },
                { label: 'Email', value: () => this.patient()?.email || '-' },
                { label: 'CPF', value: () => this.patient()?.documentNumber || '-' },
                { label: 'Telefone', value: () => '-' },
                { label: 'Data de Nascimento', value: () => '-' },
                { label: 'Gênero', value: () => '-' },
            ]
        }
    ]

}