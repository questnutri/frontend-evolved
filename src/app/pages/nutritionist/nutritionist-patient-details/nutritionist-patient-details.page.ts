import { Component, effect, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DietModel, Patient } from '@qn/models';
import { PatientService } from '@qn/services';
import { ActivatedRoute, Router, RouterLinkActive, RouterModule } from "@angular/router";

@Component({
    selector: 'nutritionist-patient-details',
    templateUrl: './nutritionist-patient-details.page.html',
    styleUrls: ['./nutritionist-patient-details.page.scss'],
    imports: [
        RouterModule,
        RouterLinkActive,
        CommonModule
    ],
})
export class NutritionistPatientDetailsPage {
    private readonly patientService = inject(PatientService);
    protected readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
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

    patientNavItems = [
        {
            label: 'Informações',
            icon: 'pi pi-user',
            route: 'info'
        },
        {
            label: 'Dietas',
            icon: 'pi pi-apple',
            route: 'diets'
        },
        {
            label: 'Dados de Saúde',
            icon: 'pi pi-heart',
            route: 'health'
        },
        {
            label: 'Registros',
            icon: 'pi pi-file',
            route: 'records'
        }
    ];

    backToPatients() {
        this.router.navigate(['/nutritionist/patients']);
    }

}