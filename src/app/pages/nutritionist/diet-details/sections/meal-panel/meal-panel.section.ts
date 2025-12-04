import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QnButtonComponent, QnNumberInputComponent, QnTextInputComponent } from "@qn/components/basic";
import { QnLabelDirective } from "@qn/directives";
import { Aliment, AlimentModel, MealModel } from '@qn/models';
import { AccordionModule } from 'primeng/accordion';
import { DatePicker } from "primeng/datepicker";
import { DividerModule } from 'primeng/divider';
import { Select } from "primeng/select";
import { DialogModule } from 'primeng/dialog';
import { TableModule } from "primeng/table";
import { CheckboxModule } from 'primeng/checkbox';
import { AlimentService } from '@qn/services';
import { AlimentsTableComponent } from './aliments-table/aliments-table.component';

@Component({
    selector: 'app-meal-panel',
    templateUrl: './meal-panel.section.html',
    styleUrls: ['./meal-panel.section.scss'],
    imports: [
        DatePicker,
        FormsModule,
        Select,
        QnNumberInputComponent,
        QnButtonComponent,
        QnTextInputComponent,
        QnLabelDirective,
        DividerModule,
        AccordionModule,
        DialogModule,
        TableModule,
        CheckboxModule,
        AlimentsTableComponent // Adicionar aqui
    ],
})
export class MealPanelSection {

    private readonly alimentService = inject(AlimentService);

    // INPUTS / OUTPUTS
    meal = input.required<MealModel>();
    closeEditMeal = output<void>();
    saveMeal = output<MealModel>(); // Output para devolver a cópia editada

    // FORM DATA (Cópia editável)
    editMeal = signal<MealModel | null>(null);

    // CONTROLADORES DE UI (Para o PrimeNG funcionar com Dates vs Strings)
    formDate = signal<Date | null>(null);
    formEndDate = signal<Date | null>(null);
    formHour = signal<Date | null>(null);

    // CONFIGURAÇÃO DE REPETIÇÃO
    valueRepeat = signal<string>('ONCE');
    interval = signal<number>(1);
    selectedDays = signal<number[]>([]);
    selectedMonthDates = signal<Date[]>([]);
    modalAlimentsVisible = signal<boolean>(false); // Renomear para evitar conflito

    // CONFIGURAÇÕES VISUAIS
    showRepeatConfig = signal<boolean>(false);
    minViewDate = signal<Date>(new Date(2024, 11, 1));
    maxViewDate = signal<Date>(new Date(2025, 0, 1));

    aliments = signal<any[]>([{ nome: 'Maçã', calorias: 52, proteina: 7, carboidratos: 18, gorduras: 5 }, { nome: 'Banana', calorias: 89, proteina: 7, carboidratos: 18, gorduras: 5 }, { nome: 'Arroz', calorias: 130, proteina: 7, carboidratos: 18, gorduras: 5 }, { nome: 'Arroz', calorias: 130, proteina: 7, carboidratos: 18, gorduras: 5 }, { nome: 'Arroz', calorias: 130, proteina: 7, carboidratos: 18, gorduras: 5 }, { nome: 'Arroz', calorias: 130, proteina: 7, carboidratos: 18, gorduras: 5 }, { nome: 'Arroz', calorias: 130, proteina: 7, carboidratos: 18, gorduras: 5 }, { nome: 'Arroz', calorias: 130, proteina: 7, carboidratos: 18, gorduras: 5 }]);
    checked = signal<string | null>(null);

    weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    optionRepeatConfiguration = [
        { label: 'Nunca', value: 'ONCE' },
        { label: 'Diariamente', value: 'DAILY' },
        { label: 'Semanalmente', value: 'WEEKLY' },
        { label: 'Mensalmente', value: 'MONTHLY' },
    ];



    constructor() {
        effect(() => {
            const originalMeal = this.meal();
            console.log(originalMeal);

            if (originalMeal) {
                const copy = MealModel.from(originalMeal);
                this.editMeal.set(copy);

                this.formDate.set(copy.startDate ? new Date(copy.startDate) : new Date());
                this.formEndDate.set(copy.endDate ? new Date(copy.endDate) : null);
                if (copy.hour) {
                    const [h, m] = copy.hour.split(':').map(Number);
                    const timeDate = new Date();
                    timeDate.setHours(h, m, 0);
                    this.formHour.set(timeDate);
                }

                const config = copy.repeatConfiguration;

                this.valueRepeat.set(config?.type || 'ONCE');
                this.interval.set(config?.repeatTarget || 1);

                if (config?.type === 'WEEKLY' && config?.daysOfWeek) {
                    this.selectedDays.set(config.daysOfWeek);
                } else {
                    this.selectedDays.set([]);
                }


                if (config?.type === 'MONTHLY' && config?.daysOfMonth) {
                    const baseDate = this.minViewDate();
                    const dates = config.daysOfMonth.map(day => {
                        return new Date(baseDate.getFullYear(), baseDate.getMonth(), day);
                    });
                    this.selectedMonthDates.set(dates);
                } else {
                    this.selectedMonthDates.set([new Date(this.minViewDate().getFullYear(), this.minViewDate().getMonth(), 1)]);
                }
            }
        });

    }



    textFrequency = computed(() => {
        const type = this.valueRepeat();
        if (type === 'DAILY') return { value1: 'Repetir a cada', value2: 'dia(s)' };
        if (type === 'WEEKLY') return { value1: 'Acontece a cada', value2: 'semana(s)' };
        if (type === 'MONTHLY') return { value1: 'Acontece a cada', value2: 'mês(es)' };
        return { value1: '', value2: '' };
    });

    summaryRepeatConfiguration = computed(() => {
        const type = this.valueRepeat();
        const target = this.interval();

        if (type == 'ONCE') return 'Não se repete';
        if (type == 'DAILY') return `Refeição acontece diariamente a cada ${target} dia(s)`;
        if (type == 'WEEKLY') return `Refeição acontece semanalmente a cada ${target} semana(s)`;
        if (type == 'MONTHLY') return `Refeição acontece mensalmente a cada ${target} mês(es)`;

        return '';
    });

    toggleDayOfWeeks(dayIndex: number) {
        this.selectedDays.update(days => {
            if (days.includes(dayIndex)) {
                return days.filter(d => d !== dayIndex);
            } else {
                return [...days, dayIndex].sort((a, b) => a - b);
            }
        });
    }

    showRepeatConfiguration() {
        this.showRepeatConfig.update(show => !show);
    }

    calculateTotalPortion(portion: string | undefined, quantity: string | undefined): string {
        if (!portion || !quantity) return '';
        if (portion === '100g') {
            const quantityNumber = parseFloat(quantity) || 1;
            const total = quantityNumber * 100;
            return total + ' g';
        }

        return `${quantity} x ${portion}`;
    }

    calculateTotalMacro(macro: string, quantity: string | undefined): string {
        if (!quantity) return '';
        const quantityNumber = parseFloat(quantity) || 1;
        const macroNumber = parseFloat(macro) || 0;
        const total = quantityNumber * macroNumber;
        return total.toFixed(2);
    }

    handleSave() {
        const currentEdit = this.editMeal();
        if (!currentEdit) return;

        if (this.formDate()) currentEdit.startDate = this.formDate()!;
        if (this.formEndDate()) currentEdit.endDate = this.formEndDate()!;
        else currentEdit.endDate = null;

        if (this.formHour()) {
            const h = this.formHour()!.getHours().toString().padStart(2, '0');
            const m = this.formHour()!.getMinutes().toString().padStart(2, '0');
            currentEdit.hour = `${h}:${m}`;
        }

        const type = this.valueRepeat();
        const target = this.interval();

        let newConfig: any = {
            type: type
        };

        switch (type) {
            case 'ONCE':
                if (this.formDate()) {
                    newConfig.targetDate = this.formDate()!.toISOString().split('T')[0];
                }
                break;

            case 'DAILY':
                newConfig.repeatTarget = target;
                break;

            case 'WEEKLY':
                newConfig.repeatTarget = target;
                newConfig.daysOfWeek = this.selectedDays().sort((a, b) => a - b);
                break;

            case 'MONTHLY':
                newConfig.repeatTarget = target;
                const daysAsNumbers = this.selectedMonthDates()
                    .map(date => date.getDate())
                    .sort((a, b) => a - b);

                newConfig.daysOfMonth = [...new Set(daysAsNumbers)];
                break;
        }

        currentEdit.repeatConfiguration = newConfig;
        delete (currentEdit as any).createdAt;
        delete (currentEdit as any).updatedAt;
        delete (currentEdit as any).foods;
        console.log('Salvando refeição editada:', currentEdit);
    }

    showModalNewDiet() {
        this.modalAlimentsVisible.set(true);
    }

    closeModalAliments() {
        this.modalAlimentsVisible.set(false);
    }
}