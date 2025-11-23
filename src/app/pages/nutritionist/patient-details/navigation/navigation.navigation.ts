import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive, RouterModule } from '@angular/router';
import { Patient } from '@qn/models';

@Component({
    imports: [
        CommonModule,
        RouterModule,
        RouterLinkActive
    ],
    selector: 'app-nutritionist-patient-details-navigation',
    templateUrl: './navigation.navigation.html',
    styleUrls: ['./navigation.navigation.scss'],
})
export class NutritionistPatientDetailsNavigation {
    protected readonly activatedRoute = inject(ActivatedRoute);
    private readonly router = inject(Router);
    patient = input.required<Patient>();

    patientNavItems = [
        {
            label: '',
            icon: 'pi-arrow-left',
            route: 'patients'
        },
        {
            label: 'Informações',
            icon: 'pi-user',
            route: 'info'
        },
        {
            label: 'Dietas',
            icon: 'pi-apple',
            route: 'diets'
        },
        {
            label: 'Dados de Saúde',
            icon: 'pi-heart',
            route: 'health'
        },
        {
            label: 'Registros',
            icon: 'pi-file',
            route: 'records'
        }
    ];

    backToPatients() {
        this.router.navigate(['/nutritionist/patients']);
    }
}