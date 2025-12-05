import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { QnButtonComponent, QnDiv, QnDropDownComponent, QnMaskInputComponent, QnTextInputComponent } from "@qn/components/basic";
import { QnLabelDirective } from "@qn/directives";
import { Patient } from '@qn/models';
import { NotificationService, PatientService } from '@qn/services';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

interface SortOption {
    label: string;
    value: string;
}

interface GenderOption {
    label: string;
    value: string;
}

interface ActivityLevelOption {
    label: string;
    value: string;
}

enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER'
}

enum LevelOfActivity {
    ONE = 'ONE',
    TWO = 'TWO',
    THREE = 'THREE',
    FOUR = 'FOUR',
    FIVE = 'FIVE'
}

interface CreatePatientForm {
    firstName: string;
    lastName: string;
    email: string;
    documentNumber: string;
    dateOfBirth?: Date;
    phone?: string;
    gender?: string;
    heightInCm?: number;
    levelOfActivity?: string;
}

@Component({
    selector: 'nutritionist-patients',
    templateUrl: './patients-list.page.html',
    styleUrls: ['./patients-list.page.scss'],
    imports: [
        FormsModule,
        QnDiv,
        QnTextInputComponent,
        QnDropDownComponent,
        QnButtonComponent,
        QnLabelDirective,
        QnMaskInputComponent,
        TableModule,
        DialogModule,
        InputNumberModule,
        DatePickerModule,
        SelectModule
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
    showNewPatientDialog = signal(false);
    saving = signal(false);

    // Form signals
    newPatient = signal<CreatePatientForm>({
        firstName: '',
        lastName: '',
        email: '',
        documentNumber: '',
        dateOfBirth: undefined,
        phone: undefined,
        gender: undefined,
        heightInCm: undefined,
        levelOfActivity: undefined
    });

    today = new Date();

    // Filtros
    selectedSort = signal<string>('name-asc');
    sortOptions: SortOption[] = [
        { label: 'Nome (A → Z)', value: 'name-asc' },
        { label: 'Nome (Z → A)', value: 'name-desc' },
        { label: 'Mais recente', value: 'date-desc' },
        { label: 'Mais antigo', value: 'date-asc' }
    ];

    genderOptions: GenderOption[] = [
        { label: 'Masculino', value: Gender.MALE },
        { label: 'Feminino', value: Gender.FEMALE },
        { label: 'Outro', value: Gender.OTHER }
    ];

    activityLevelOptions: any[] = [
        { label: 'Sedentário', value: "1" },
        { label: 'Levemente ativo', value: "2" },
        { label: 'Moderadamente ativo', value: "3" },
        { label: 'Muito ativo', value: "4" },
        { label: 'Extremamente ativo', value: "5" }
    ];

    constructor() {
        effect(async () => {
            const patients = await this.patientService.getAll();
            if (patients) {
                this.patients.set(patients.items);
            }
        });
    }

    viewPatient(patientId: string) {
        this.router.navigateRoot(`/nutritionist/patient/${patientId}`);
    }

    openNewPatientDialog() {
        this.resetForm();
        this.showNewPatientDialog.set(true);
    }

    closeNewPatientDialog() {
        this.showNewPatientDialog.set(false);
        this.resetForm();
    }

    resetForm() {
        this.newPatient.set({
            firstName: '',
            lastName: '',
            email: '',
            documentNumber: '',
            dateOfBirth: undefined,
            phone: undefined,
            gender: undefined,
            heightInCm: undefined,
            levelOfActivity: undefined
        });
    }

    updateFormField<K extends keyof CreatePatientForm>(field: K, value: CreatePatientForm[K]) {
        this.newPatient.update(current => ({
            ...current,
            [field]: value
        }));
    }

    async saveNewPatient() {
        const form = this.newPatient();

        // Validate required fields
        const requiredFields: { field: keyof CreatePatientForm; label: string }[] = [
            { field: 'firstName', label: 'Nome' },
            { field: 'lastName', label: 'Sobrenome' },
            { field: 'email', label: 'E-mail' },
            { field: 'documentNumber', label: 'CPF' }
        ];

        const emptyFields = requiredFields
            .filter(({ field }) => !form[field] || form[field].toString().trim() === '')
            .map(({ label }) => label);

        if (emptyFields.length > 0) {
            this.notificationService.add({
                severity: 'warn',
                summary: 'Campos obrigatórios',
                detail: `Preencha os seguintes campos: ${emptyFields.join(', ')}.`
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            this.notificationService.add({
                severity: 'error',
                summary: 'E-mail inválido',
                detail: 'Por favor, insira um e-mail válido.'
            });
            return;
        }

        this.saving.set(true);

        try {
            const payload = {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                documentNumber: form.documentNumber.replace(/\D/g, ''),
                dateOfBirth: form.dateOfBirth ? form.dateOfBirth.toISOString().split('T')[0] : undefined,
                phone: form.phone || undefined,
                gender: form.gender as Gender | undefined,
                heightInCm: form.heightInCm ? form.heightInCm.toString() : undefined,
                levelOfActivity: form.levelOfActivity as LevelOfActivity | undefined
            };

            const newPatient = await this.patientService.create(payload);

            if (newPatient) {
                this.patients.update(patients => [newPatient, ...patients]);
                this.notificationService.add({
                    severity: 'success',
                    summary: 'Paciente criado',
                    detail: `${form.firstName} ${form.lastName} foi adicionado com sucesso.`
                });
                this.closeNewPatientDialog();
                await this.router.navigateRoot(`/nutritionist/patient/${newPatient.id}`);
            }
        } catch (error: any) {
            this.notificationService.add({
                severity: 'error',
                summary: 'Erro ao criar paciente',
                detail: error?.message || 'Ocorreu um erro ao criar o paciente.'
            });
        } finally {
            this.saving.set(false);
        }
    }
}