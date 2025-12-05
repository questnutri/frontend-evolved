import { Component, OnInit, inject } from '@angular/core';
import { PatientService, NotificationService } from '@qn/services';
import { PatientModel } from '@qn/models';

@Component({
    selector: 'app-patient-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class PatientProfileComponent implements OnInit {
    private readonly patientService = inject(PatientService);
    private readonly notificationService = inject(NotificationService);

    patient: PatientModel | null = null;
    isEditing: boolean = false;

    async ngOnInit() {
        this.patient = await this.patientService.getPatientProfile();
    }

    handleEdit() {
        this.isEditing = !this.isEditing;
    }

    async handleSave() {
        if (this.patient) {
            await this.patientService.updatePatientProfile(this.patient);
            this.notificationService.add({
                severity: 'success',
                summary: 'Profile Updated',
                detail: 'Your profile has been successfully updated.',
            });
            this.isEditing = false;
        }
    }

    handleCancel() {
        this.isEditing = false;
        this.ngOnInit(); // Reload patient data
    }
}