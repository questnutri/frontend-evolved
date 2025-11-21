import { Component, effect, inject, input, signal } from '@angular/core';
import { NavController } from '@ionic/angular';
import { QnDiv } from "@qn/components/basic";
import { DietModel, Patient } from '@qn/models';
import { PatientService, DietService } from '@qn/services';
import { NutritionistPatientInfoPage } from "./nutritionist-patient-info/nutritionist-patient-info.page";
import { NutritionistPatientDietsPage } from "./nutritionist-patient-diets/nutritionist-patient-diets.page";

@Component({
    selector: 'nutritionist-patient-details',
    templateUrl: './nutritionist-patient-details.page.html',
    styleUrls: ['./nutritionist-patient-details.page.scss'],
    imports: [QnDiv, NutritionistPatientInfoPage, NutritionistPatientDietsPage],
})
export class NutritionistPatientDetailsPage {
    private readonly patientService = inject(PatientService);
    private readonly dietService = inject(DietService);
    private readonly router = inject(NavController);
    patientId = input.required<string>();
    patient = signal<Patient | null>(null);
    patientDiets = signal<DietModel[]>([]);
    activeMenuItem = signal<string>('information');

    constructor() {
        effect(async () => {
            if (this.patientId()) {
                const patientData = await this.patientService.getById(this.patientId());
                this.patient.set(patientData);
            }
        })
    }

    async loadPatientDiets() {
        const id = this.patientId();
        const dietsData = await this.dietService.getDiets(id);
        console.log(dietsData);

        this.patientDiets.set(dietsData);
    }

    backToPatients() {
        this.router.navigateRoot('/nutritionist/patients');
    }

    setActiveMenuItem(item: string) {
        if (item === 'diets') {
            this.loadPatientDiets();
        }

        this.activeMenuItem.set(item);
    }

}