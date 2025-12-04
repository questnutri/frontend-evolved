import { Component, computed, effect, inject, input, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { QnButtonComponent, QnTextInputComponent } from "@qn/components/basic";
import { DietModel } from '@qn/models';
import { DietService } from '@qn/services';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DietStatusPipe } from 'src/app/shared/pipes/diet-status-pipe';
import { DatePicker } from "primeng/datepicker";
import { QnLabelDirective } from "@qn/directives";
import { FormsModule } from '@angular/forms';
import { Popover, PopoverModule } from 'primeng/popover';


@Component({
    selector: 'app-nutritionist-patient-diets',
    templateUrl: './diets.section.html',
    styleUrls: ['./diets.section.scss'],
    imports: [QnButtonComponent, DietStatusPipe, ChipModule, DialogModule, QnTextInputComponent, DatePicker, QnLabelDirective, FormsModule, PopoverModule],
})
export class NutritionistPatientDietsSection {
    private readonly router = inject(Router);
    private readonly dietService = inject(DietService);
    patientId = input.required<string>();
    visible = signal<boolean>(false);
    diets = signal<DietModel[]>([]);
    newDiet = signal<DietModel>(new DietModel());
    datesNewDiet = signal<{ startDate: Date; endDate: Date | null }>({ startDate: new Date(), endDate: null });
    editDiet = signal<DietModel | null>(null);
    datesEditDiet = signal<{ startDate: Date; endDate: Date | null }>({ startDate: new Date(), endDate: null });
    @ViewChild('dietMenu') popover!: Popover;

    constructor() {
        effect(async () => {
            const currentPatientId = this.patientId();
            if (currentPatientId) {
                const patientDiets = await this.dietService.getDiets(currentPatientId);
                this.diets.set(patientDiets);

                this.newDiet.update(diet => {
                    const updatedDiet = DietModel.from(diet);
                    updatedDiet.patientId = currentPatientId;
                    return updatedDiet;
                });
            }
        });
        effect(() => {
            const dates = this.datesNewDiet();
            const newStartDate = dates.startDate;
            const newEndDate = dates.endDate ? dates.endDate : undefined;

            this.newDiet.update(diet => {
                const updatedDiet = DietModel.from(diet);

                updatedDiet.startDate = newStartDate;
                updatedDiet.endDate = newEndDate;

                return updatedDiet;
            });
        });

    }

    dateFormat(date: Date | undefined): string {
        if (!date) {
            return '';
        }
        if (date instanceof Date === false) {
            date = new Date(date);
        }
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    doOnSeeDiet(dietId: string) {
        this.router.navigate(['/nutritionist/patient', this.patientId(), 'diet', dietId]);
    }

    showModalNewDiet() {
        this.visible.set(true);
    }

    // Para fechar o popover após clicar em uma opção
    hidePopover(event: Event) {
        // PrimeNG não tem método hide() direto no template, então usamos uma referência
        // Alternativa mais simples: usar #dietMenu no popover e chamar hide()
        // ou simplesmente deixar aberto e fechar com o clique fora (comportamento padrão)
    }
    activateDiet(dietId: string) {
        // sua lógica
        this.popover.hide();
    }

    editDietSelected(diet: any) {
        // sua lógica
        this.popover.hide();
    }

    async createDiet() {
        const diet = this.newDiet();

        const createDietDto = {
            name: diet.name ?? '',
            patientId: diet.patientId ?? '',
            startDate: diet.startDate ?? new Date(),
            endDate: diet.endDate ?? undefined,
            description: diet.description ?? ''
        };

        await this.dietService.createDiet(createDietDto as any);

        this.visible.set(false);
        const patientId = this.patientId();
        if (patientId) {
            const patientDiets = await this.dietService.getDiets(patientId);
            this.diets.set(patientDiets);
        }
    }
}
