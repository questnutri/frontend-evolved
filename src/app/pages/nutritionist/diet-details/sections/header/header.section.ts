import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DietModel, Patient } from '@qn/models';
import { DietService, PatientService } from '@qn/services';
import { Chip } from "primeng/chip";
import { DatePicker } from "primeng/datepicker";
import { BackButtonComponent } from "src/app/shared/components/core/back-button/back-button.component";
import { DietStatusPipe } from 'src/app/shared/pipes/diet-status-pipe';

@Component({
    selector: 'app-patient-diet-details-header',
    templateUrl: './header.section.html',
    styleUrls: ['./header.section.scss'],
    imports: [
        BackButtonComponent,
        DatePicker,
        FormsModule,
        Chip,
        DietStatusPipe
    ],
})
export class PatientDietDetailsHeaderSection {
    private readonly router = inject(Router);
    private readonly patientService = inject(PatientService);
    private readonly dietService = inject(DietService);

    patientId = input.required<string>();
    diet = input.required<DietModel>();

    patient = signal<Patient | null>(null);
    startDate = signal<Date | null>(null);
    endDate = signal<Date | null>(null);

    dietUpdated = output<void>();

    private readonly today = new Date();

    constructor() {
        effect(() => {
            const id = this.patientId();
            if (id) this.loadPatient(id);
        });

        effect(() => {
            const diet = this.diet();
            if (!diet) return;

            const todayNormalized = this.getMidnight(new Date());
            const dietStart = this.getMidnight(new Date(diet.startDate));
            const dietEnd = diet.endDate ? this.getMidnight(new Date(diet.endDate)) : null;

            if (diet.status === 'DEFINITION' && dietStart.getTime() < todayNormalized.getTime()) {
                this.startDate.set(todayNormalized);
                this.endDate.set(dietEnd);

                this.patchDietDates(todayNormalized, dietEnd);
            } else {
                this.startDate.set(dietStart);
                this.endDate.set(dietEnd);
            }

        }, { allowSignalWrites: true });
    }

    minDateStartPicker = computed(() => {
        return this.getMidnight(new Date());
    });

    maxDateStartPicker = computed(() => {
        const currentEnd = this.endDate();
        if (currentEnd) {
            const max = new Date(currentEnd);
            max.setDate(max.getDate() - 1);
            return max;
        }
        return null;
    });

    minDateEndPicker = computed(() => {
        const currentStart = this.startDate();
        if (currentStart) {
            const min = new Date(currentStart);
            min.setDate(min.getDate() + 1);
            return min;
        }
        return this.getMidnight(new Date());
    });


    disabledDates = computed(() => {
        const diet = this.diet();
        if (!diet) return { disabledStartDate: false, disabledEndDate: false };

        const today = this.getMidnight(new Date());
        const start = this.startDate();
        const end = this.endDate();

        if (diet.status === 'ACTIVE') {
            const isStartLocked = start ? start.getTime() <= today.getTime() : true;

            const isEndLocked = end ? end.getTime() <= today.getTime() : false;

            return {
                disabledStartDate: isStartLocked,
                disabledEndDate: isEndLocked
            };
        }

        return {
            disabledStartDate: false,
            disabledEndDate: false
        };
    });

    onDateChange() {
        const start = this.startDate();
        const end = this.endDate();

        if (start && end && start >= end) {
            console.warn("Data inválida: Início deve ser menor que fim");
            return;
        }

        this.patchDietDates(start, end);
    }

    private async patchDietDates(newStart: Date | null, newEnd: Date | null) {
        if (!newStart) return;

        const startPayload = new Date(newStart);
        startPayload.setHours(0, 0, 0, 0);

        let endPayload = null;
        if (newEnd) {
            endPayload = new Date(newEnd);
            endPayload.setHours(0, 0, 0, 0);
        }

        try {
            await this.dietService.patchDiet(this.diet().id, {
                startDate: startPayload.toISOString(),
                endDate: endPayload ? endPayload.toISOString() : null
            });
            this.dietUpdated.emit();
        } catch (error) {
            console.error("Erro ao atualizar datas:", error);
        }
    }

    private async loadPatient(id: string) {
        try {
            const response = await this.patientService.getById(id);
            this.patient.set(response || null);
        } catch (err) {
            console.error("Erro ao carregar paciente:", err);
        }
    }

    goBackToPatient() {
        this.router.navigate(['/nutritionist', 'patient', this.patientId(), 'diets']);
    }

    private getMidnight(date: Date): Date {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }
}