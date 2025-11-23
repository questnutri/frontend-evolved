import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { BackButtonComponent } from "src/app/shared/components/core/back-button/back-button.component";

@Component({
    selector: 'app-diet-details',
    templateUrl: './diet-details.component.html',
    styleUrls: ['./diet-details.component.scss'],
    imports: [BackButtonComponent],
})
export class PatientDietDetailsPage {
    patientId = input.required<string>();
    private readonly router = inject(Router);

    goBackToPatient() {
        this.router.navigate(['/nutritionist', 'patient', this.patientId(), 'diets']);
    }
}
