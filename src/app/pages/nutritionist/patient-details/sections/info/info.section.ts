import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { Patient } from '@qn/models';
import { PatientService } from '@qn/services';
import { GenderPipe } from 'src/app/shared/pipes/gender-pipe';
import { QnTextInputComponent, QnTextAreaComponent, QnButtonComponent } from "@qn/components/basic";
import { QnLabelDirective } from "@qn/directives";

@Component({
    selector: 'app-nutritionist-patient-info',
    templateUrl: './info.section.html',
    styleUrls: ['./info.section.scss'],
    imports: [GenderPipe, QnTextInputComponent, QnLabelDirective, QnTextAreaComponent, QnButtonComponent],
})
export class NutritionistPatientInfoSection {
    patientId = input.required<string>();
    protected patient = signal<Patient | null>(null);
    private readonly patientService = inject(PatientService);

    medicalInfoEdit = signal<boolean>(false);
    physicalInfoEdit = signal<boolean>(false);

    constructor() {
        effect(async () => {
            if (this.patientId()) {
                const foundPatient = await this.patientService.getById(this.patientId());
                this.patient.set(foundPatient);

            }
        })
    }

    protected physicalInfoEditable = computed(() => this.physicalInfoEdit());
    protected medicalInfoEditable = computed(() => this.medicalInfoEdit());

    infoSections = [
        {
            mainLabel: 'Dados Pessoais',
            functionToCall: () => { },
            isPossibleEdit: false,
            editable: () => false,
            details: [
                { label: 'Nome', value: () => this.patient()?.firstName + ' ' + this.patient()?.lastName || '-', fieldEdit: false, inputType: 'text' },
                { label: 'Email', value: () => this.patient()?.email || '-', fieldEdit: false, inputType: 'text' },
                { label: 'CPF', value: () => this.patient()?.documentNumber || '-', fieldEdit: false, inputType: 'text' },
                { label: 'Telefone', value: () => this.patient()?.phone || '-', fieldEdit: false, inputType: 'text' },
                {
                    label: 'Data de Nascimento',
                    value: () => this.patient()?.dateOfBirth
                        ? new Date(this.patient()!.dateOfBirth + 'T00:00:00').toLocaleDateString('pt-BR')
                        : '-',
                    fieldEdit: false,
                    inputType: 'text'
                },
                { label: 'Gênero', value: () => this.patient()?.gender || '-', fieldEdit: false, inputType: 'text' },
            ],
            class: 'info-details-grid'
        },
        {
            mainLabel: 'Dados Físicos',
            isPossibleEdit: true,
            editable: this.physicalInfoEditable,
            functionToCall: () => this.handleEditPhysicalInfo(),
            details: [
                { label: 'Altura', value: () => this.physicalInfoEditable() ? this.patient()?.heightInCm || '-' : this.patient()?.heightInCm + ' cm' || '-', fieldEdit: true, inputType: 'text' },
                { label: 'Último Peso', value: () => this.patient()?.lastWeight ? this.patient()!.lastWeight + ' kg' : '-', fieldEdit: false, inputType: 'text' },
                { label: 'IMC', value: () => this.patient()?.imc || '-', fieldEdit: false, inputType: 'text' },
            ],
            class: 'physical-details-grid'
        },
        {
            mainLabel: 'Informações Médicas',
            isPossibleEdit: true,

            editable: this.medicalInfoEditable,
            functionToCall: () => this.handleEditMedicalInfo(),
            details: [
                { label: 'Condições Médicas', value: () => this.patient()?.medicalConditions || '-', fieldEdit: true, inputType: 'textarea' },
                { label: 'Notas', value: () => this.patient()?.notes || '-', fieldEdit: true, inputType: 'textarea' },
            ],
            class: 'medical-details-grid'
        }
    ]

    handleEditMedicalInfo() {
        this.medicalInfoEdit.set(!this.medicalInfoEdit());
    }
    handleEditPhysicalInfo() {
        this.physicalInfoEdit.set(!this.physicalInfoEdit());
    }
}