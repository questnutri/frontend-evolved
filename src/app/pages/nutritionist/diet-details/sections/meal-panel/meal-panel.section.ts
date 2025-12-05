import { Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
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
import { AlimentService, MealService } from '@qn/services';
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
export class MealPanelSection implements OnInit {

    private readonly alimentService = inject(AlimentService);
    private readonly mealService = inject(MealService);

    // INPUTS / OUTPUTS
    meal = input.required<MealModel>();
    currentRelativeDate = input.required<string>(); // Novo input
    closeEditMeal = output<void>();
    saveMeal = output<MealModel>();
    mealUpdated = output<void>(); // Novo output para notificar atualização

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
    editInfos = signal<boolean>(false);
    editRepeatConfig = signal<boolean>(false);


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


    ngOnInit() {
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
        if (!this.canEditMeal() || !this.editRepeatConfig()) return;

        this.selectedDays.update(days => {
            if (days.includes(dayIndex)) {
                return days.filter(d => d !== dayIndex);
            } else {
                return [...days, dayIndex];
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

    async handleSave(infosOnly: boolean = false, repeatOnly: boolean = false) {
        const currentEdit = this.editMeal();
        if (!currentEdit) return;

        if (this.formDate()) currentEdit.startDate = this.formDate()!.toISOString().split('T')[0] as any;
        if (this.formEndDate()) currentEdit.endDate = this.formEndDate()!.toISOString().split('T')[0] as any;
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
        if (currentEdit.endDate === null) {
            delete (currentEdit as any).endDate;
        }
        if (infosOnly) {
            delete (currentEdit as any).repeatConfiguration;
        }
        if (repeatOnly) {
            delete (currentEdit as any).name;
            delete (currentEdit as any).description;
            delete (currentEdit as any).hour;
            delete (currentEdit as any).startDate;
            delete (currentEdit as any).endDate;
        }

        try {
            const result = await this.mealService.patchMeal(currentEdit, currentEdit.id);

            if (result) {
                this.saveMeal.emit(currentEdit);
                this.mealUpdated.emit(); // Emite evento de atualização
            }
        } catch (error) {
            console.error('Error updating meal:', error);
        }

        this.editInfos.set(false);
        this.editRepeatConfig.set(false);
    }

    handleClickEdit(field: string) {
        if (field === 'repeat') {
            this.editRepeatConfig.update(edit => !edit);
            return;
        } else {

            this.editInfos.update(edit => !edit);
        }
    }

    showModalNewDiet() {
        this.modalAlimentsVisible.set(true);
    }

    closeModalAliments() {
        this.modalAlimentsVisible.set(false);
    }

    handleCancelEdit(field: string) {
        if (field === 'infos') {
            // Reseta os dados de informações
            const originalMeal = this.meal();
            this.editMeal.set(MealModel.from(originalMeal));

            // Reseta os campos de formulário
            this.formDate.set(originalMeal.startDate ? new Date(originalMeal.startDate) : null);
            this.formEndDate.set(originalMeal.endDate ? new Date(originalMeal.endDate) : null);
            this.formHour.set(originalMeal.hour ? this.parseHourToDate(originalMeal.hour) : null);

            this.editInfos.set(false);
        } else if (field === 'repeat') {
            // Reseta os dados de repetição
            const originalMeal = this.meal();
            const config = originalMeal.repeatConfiguration;

            if (config) {
                this.valueRepeat.set(config.type || 'ONCE');
                this.interval.set(config.repeatTarget || 1);
                this.selectedDays.set(config.daysOfWeek || []);

                if (config.daysOfMonth) {
                    const baseDate = this.minViewDate();
                    const dates = config.daysOfMonth.map(d => new Date(baseDate.getFullYear(), baseDate.getMonth(), d));
                    this.selectedMonthDates.set(dates);
                } else {
                    this.selectedMonthDates.set([]);
                }
            }

            this.editRepeatConfig.set(false);
        }
    }

    private parseHourToDate(hourStr: string | undefined | null): Date | null {
        if (!hourStr) return null;
        const parts = hourStr.split(':').map(Number);
        const hours = isNaN(parts[0]) ? 0 : parts[0];
        const minutes = isNaN(parts[1]) ? 0 : parts[1];
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        return d;
    }

    canEditMeal = computed(() => {
        const meal = this.editMeal();
        const relativeDate = this.currentRelativeDate();
        if (!meal) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Converte o relativeDate para Date
        const [year, month, day] = relativeDate.split('-').map(Number);
        const currentDate = new Date(year, month - 1, day);
        currentDate.setHours(0, 0, 0, 0);

        // Permite editar apenas se a data relativa for hoje ou no futuro
        return currentDate >= today;
    });

    canEditStartDate = computed(() => {
        const meal = this.editMeal();
        if (!meal || !meal.startDate) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const mealStartDate = new Date(meal.startDate);
        mealStartDate.setHours(0, 0, 0, 0);

        // Só pode editar a data de início se ela for maior que hoje
        return mealStartDate > today;
    });

    showButton = computed(() => {
        return this.canEditMeal();
    });

    async onAlimentAdded() {
        // Emite evento para o componente pai atualizar o diet plan
        this.mealUpdated.emit();
    }
}