import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { QnButtonComponent, QnDiv, QnDropDownComponent, QnTextInputComponent } from "@qn/components/basic";
import { QnLabelDirective } from "@qn/directives";
import { Patient } from '@qn/models';
import { NotificationService, PatientService } from '@qn/services';
import { TableModule } from 'primeng/table';

interface SortOption {
    label: string;
    value: string;
}

@Component({
    selector: 'nutritionist-patients',
    templateUrl: './patients-list.page.html',
    styleUrls: ['./patients-list.page.scss'],
    imports: [
        FormsModule,  // ← IMPORTANTE para ngModel funcionar
        QnDiv,
        QnTextInputComponent,
        QnDropDownComponent,
        QnButtonComponent,
        QnLabelDirective,
        TableModule
    ],
    standalone: true
})
export class NutritionistPatientsPage {
    private readonly patientService = inject(PatientService);
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(NavController);


    // Signals
    patients = signal<Patient[]>([]);
    loading = signal(false);
    searchTerm = signal<string>('');

    // Filtros
    selectedSort = signal<string>('name-asc');
    sortOptions: SortOption[] = [
        { label: 'Nome (A → Z)', value: 'name-asc' },
        { label: 'Nome (Z → A)', value: 'name-desc' },
        { label: 'Mais recente', value: 'date-desc' },
        { label: 'Mais antigo', value: 'date-asc' }
    ];

    constructor() {
        effect(async () => {
            const patients = await this.patientService.getAll();
            if (patients) {
                this.patients.set(patients);
            }
        })
    }

    viewPatient(patientId: string) {
        this.router.navigateRoot(`/nutritionist/patient/${patientId}`);
        console.log('Ver paciente:', patientId);
    }

}