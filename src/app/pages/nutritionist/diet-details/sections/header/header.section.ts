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
    patient = signal<Patient | null>(null);
    diet = input.required<DietModel>();
    startDate = signal<Date | null>(null);
    endDate = signal<Date | null>(null);
    disabledDates = signal<any>({
        disabledStartDate: false,
        disabledEndDate: false
    })
    oldDates = signal<{ oldStart: Date | null, oldEnd: Date | null } | null>(null);
    dietUpdated = output<void>();


    constructor() {
        effect(() => {
            const id = this.patientId();
            if (!id) return;

            this.loadPatient(id);

            const diet = this.diet();
            if (!diet) return; // impede erros no primeiro ciclo

            const start = new Date(diet.startDate);
            this.startDate.set(start);

            if (diet.endDate) {
                const end = new Date(diet.endDate);
                this.endDate.set(end);
            } else {
                this.endDate.set(null);
            }
            this.updateDisabledDates();
        });

        effect(() => {
            const diet = this.diet();
            if (!diet) return;

            this.oldDates.set({
                oldStart: diet.startDate ? new Date(diet.startDate) : null,
                oldEnd: diet.endDate ? new Date(diet.endDate) : null
            });
        });

    }

    private async loadPatient(id: string) {
        try {
            const response = await this.patientService.getById(id);

            if (response) {
                this.patient.set(response);
            } else {
                console.warn("Paciente não encontrado.");
                this.patient.set(null);
            }

        } catch (err) {
            console.error("Erro ao carregar paciente:", err);
        }
    }

    private async patchDietDates(newStart: Date | null, newEnd: Date | null) {
        const newStartISO = newStart ? newStart.toISOString() : null;
        const newEndISO = newEnd ? newEnd.toISOString() : null;

        try {
            const response = await this.dietService.patchDiet(this.diet().id, { startDate: newStartISO, endDate: newEndISO });
            console.log(response);
            if (response) {
                this.dietUpdated.emit();
            }
            // this.notificationService.successWithUndo(
            //     "Datas atualizadas com sucesso.",
            //     () => this.undoDietDates()
            // );

        } catch (error) {
            console.error("Erro ao atualizar datas:", error);
            // this.notificationService.error("Erro ao atualizar as datas.");
        }
    }

    private undoDietDates() {
        const old = this.oldDates();
        if (!old) return;

        this.startDate.set(old.oldStart);
        this.endDate.set(old.oldEnd);

        // reenviar PATCH restaurando valores antigos
        this.patchDietDates(old.oldStart, old.oldEnd);
    }


    goBackToPatient() {
        this.router.navigate(['/nutritionist', 'patient', this.patientId(), 'diets']);
    }

    updateDietDates(newStartDate: Date | null, newEndDate: Date | null) {
        const diet = this.diet();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!diet) return;

        let changed = false;

        // Validar START
        if (newStartDate) {
            const planStartDate = new Date(diet.startDate);
            planStartDate.setHours(0, 0, 0, 0);

            const isPlanActive = diet.status === 'ACTIVE';
            const canChangeStart = isPlanActive && planStartDate > today;

            if (canChangeStart) {
                this.startDate.set(newStartDate);
                changed = true;
            }
        }

        // Validar END
        if (newEndDate) {
            const newEnd = new Date(newEndDate);
            newEnd.setHours(0, 0, 0, 0);

            if (newEnd > today) {
                this.endDate.set(newEnd);
                changed = true;
            }
        }

        // Se houve alteração válida → chama PATCH
        if (changed) {
            this.patchDietDates(this.startDate(), this.endDate());
        }
    }


    private updateDisabledDates() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const start = this.startDate();
        const end = this.endDate();

        let disableStart = false;
        let disableEnd = false;

        // Regra: StartDate desabilita se start <= hoje
        if (start) {
            const s = new Date(start);
            s.setHours(0, 0, 0, 0);

            disableStart = s < today;
        }

        // Regra: EndDate desabilita se end <= hoje OU se end for null
        if (end) {
            const e = new Date(end);
            e.setHours(0, 0, 0, 0);

            disableEnd = e <= today;
        } else {
            // se não existe endDate → deixa habilitado para permitir adicionar
            disableEnd = false;
        }

        this.disabledDates.set({
            disabledStartDate: disableStart,
            disabledEndDate: disableEnd,
        });

        console.log("disabledDates:", this.disabledDates());
    }

    protected maxDateStartPicker = computed(() => {
        const diet = this.diet();
        if (diet && diet.endDate) {
            const end = new Date(diet.endDate);
            end.setDate(end.getDate() - 1);
            return end;
        } else {
            return null;
        }
    });
    protected minDateEndPicker = computed(() => {
        const diet = this.diet();
        if (diet && diet.startDate) {
            const start = new Date(diet.startDate);
            start.setDate(start.getDate() + 1);
            return start;
        } else {
            return null;
        }
    });

}
