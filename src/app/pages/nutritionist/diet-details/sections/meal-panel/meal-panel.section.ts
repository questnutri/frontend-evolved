import { Component, computed, effect, inject, input, OnInit, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QnButtonComponent, QnNumberInputComponent, QnTextInputComponent } from "@qn/components/basic";
import { QnLabelDirective } from "@qn/directives";
import { Aliment, AlimentModel, FoodModel, MealModel } from '@qn/models';
import { AccordionModule } from 'primeng/accordion';
import { DatePicker } from "primeng/datepicker";
import { DividerModule } from 'primeng/divider';
import { Select, SelectModule } from "primeng/select";
import { DialogModule } from 'primeng/dialog';
import { TableModule } from "primeng/table";
import { CheckboxModule } from 'primeng/checkbox';
import { AlimentService, FoodService, MealService, NotificationService } from '@qn/services';
import { AlimentsTableComponent } from './aliments-table/aliments-table.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
    selector: 'app-meal-panel',
    standalone: true,
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
        AlimentsTableComponent,
        ConfirmPopupModule,
        SelectModule,
    ],
    providers: [ConfirmationService],
    templateUrl: './meal-panel.section.html',
    styleUrl: './meal-panel.section.scss'
})
export class MealPanelSection {
    private readonly alimentService = inject(AlimentService);
    private readonly foodService = inject(FoodService);
    private readonly mealService = inject(MealService);
    private readonly notificationService = inject(NotificationService);
    private readonly confirmationService = inject(ConfirmationService);

    // INPUTS / OUTPUTS
    meal = input.required<MealModel>();
    currentRelativeDate = input.required<string>();
    closeEditMeal = output<void>();
    saveMeal = output<MealModel>();
    mealUpdated = output<void>();

    // FORM DATA (Cópia editável)
    editMeal = signal<MealModel | null>(null);

    // CONTROLADORES DE UI
    formDate = signal<Date | null>(null);
    formEndDate = signal<Date | null>(null);
    formHour = signal<Date | null>(null);

    // CONFIGURAÇÃO DE REPETIÇÃO
    valueRepeat = signal<string>('ONCE');
    interval = signal<number>(1);
    selectedDays = signal<number[]>([]);
    selectedMonthDates = signal<Date[]>([]);
    modalAlimentsVisible = signal<boolean>(false);

    // CONFIGURAÇÕES VISUAIS
    showRepeatConfig = signal<boolean>(false);
    minViewDate = signal<Date>(new Date(2024, 11, 1));
    maxViewDate = signal<Date>(new Date(2025, 0, 1));
    editInfos = signal<boolean>(false);
    editRepeatConfig = signal<boolean>(false);

    checked = signal<string | null>(null);

    // Controle de edição de alimentos
    editingFoodIndex = signal<number | null>(null);
    editingQuantity = signal<number>(1);
    editingPortion = signal<string>('100g');
    editingQuantityType = signal<'grams' | 'units'>('grams');

    weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    optionRepeatConfiguration = [
        { label: 'Nunca', value: 'ONCE' },
        { label: 'Diariamente', value: 'DAILY' },
        { label: 'Semanalmente', value: 'WEEKLY' },
        { label: 'Mensalmente', value: 'MONTHLY' },
    ];

    optionsTypeQuantity = [
        { label: 'Gramas (g)', value: 'grams' },
        { label: 'Unidades', value: 'units' }
    ];

    constructor() {
        // Effect simplificado - só observa meal() e usa untracked para setar
        effect(() => {
            const originalMeal = this.meal();

            if (originalMeal) {
                // Usa untracked para evitar criar dependência circular
                untracked(() => {
                    this.initializeEditMeal(originalMeal);
                });
            }
        });
    }

    private initializeEditMeal(originalMeal: MealModel): void {
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

    ngOnInit() {
    }

    foods = computed(() => {
        return (this.editMeal()?.foods || []).filter((f) =>
            !f.endDate || f.endDate.split('T')[0] > this.currentRelativeDate().split('T')[0]
        );
    });

    editingPortionOptions = computed(() => {
        const index = this.editingFoodIndex();
        if (index === null) return [{ label: '100g', value: '100g' }];

        const foodsList = this.foods();
        if (!foodsList || !foodsList[index]) return [{ label: '100g', value: '100g' }];

        const food = foodsList[index];
        const aliment = food.aliment;

        if (!aliment || aliment.source === 'taco') {
            return [{ label: '100g', value: '100g' }];
        }

        if (!aliment.availablePortions || aliment.availablePortions.length === 0) {
            return [{ label: '100g', value: '100g' }];
        }

        return aliment.availablePortions.map((portionName: string) => {
            const portionData = aliment.portions?.[portionName];
            const proportion = portionData?.['proportion'] || '100';

            if (portionName === '100g') {
                return { label: portionName, value: portionName };
            }
            return {
                label: `${portionName} (${proportion}g)`,
                value: portionName
            };
        });
    });

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
                this.mealUpdated.emit();
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
            const originalMeal = this.meal();
            this.editMeal.set(MealModel.from(originalMeal));

            this.formDate.set(originalMeal.startDate ? new Date(originalMeal.startDate) : null);
            this.formEndDate.set(originalMeal.endDate ? new Date(originalMeal.endDate) : null);
            this.formHour.set(originalMeal.hour ? this.parseHourToDate(originalMeal.hour) : null);

            this.editInfos.set(false);
        } else if (field === 'repeat') {
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

        const [year, month, day] = relativeDate.split('-').map(Number);
        const currentDate = new Date(year, month - 1, day);
        currentDate.setHours(0, 0, 0, 0);

        return currentDate >= today;
    });

    canEditStartDate = computed(() => {
        const meal = this.editMeal();
        if (!meal || !meal.startDate) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const mealStartDate = new Date(meal.startDate);
        mealStartDate.setHours(0, 0, 0, 0);

        return mealStartDate > today;
    });

    showButton = computed(() => {
        return this.canEditMeal();
    });

    async onAlimentAdded() {
        this.mealUpdated.emit();
    }

    confirmDeleteFood(event: Event, food: any, index: number): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Deseja realmente excluir "${food.aliment?.name || 'este alimento'}"?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Deletar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger p-button-sm',
            rejectButtonStyleClass: 'p-button-secondary p-button-sm',
            accept: () => {
                this.deleteFood(food.id);
            }
        });
    }

    async deleteFood(foodId: string): Promise<void> {
        try {
            await this.foodService.deleteFood(foodId);

            this.notificationService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Alimento removido com sucesso.'
            });

        } catch (error) {
            console.error('Error deleting food:', error);
            this.notificationService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao remover alimento.'
            });
        } finally {
            this.editingFoodIndex.set(null);
            // Emite para o pai buscar dados atualizados do backend
            this.mealUpdated.emit();
        }
    }

    startEditFood(index: number, food: any): void {
        const currentQuantity = food.quantity;
        const portion = food.portion || '100g';
        const aliment = food.aliment;

        this.editingFoodIndex.set(index);
        this.editingPortion.set(portion);

        if (portion === '100g') {
            const quantityNumber = parseFloat(currentQuantity) || 1;
            this.editingQuantity.set(quantityNumber * 100);
            this.editingQuantityType.set('grams');
        } else {
            if (aliment?.source === 'taco') {
                const quantityNumber = parseFloat(currentQuantity) || 1;
                this.editingQuantity.set(quantityNumber * 100);
                this.editingQuantityType.set('grams');
            } else {
                const quantityNumber = parseFloat(currentQuantity) || 1;
                if (Number.isInteger(quantityNumber) && quantityNumber <= 10) {
                    this.editingQuantity.set(quantityNumber);
                    this.editingQuantityType.set('units');
                } else {
                    this.editingQuantity.set(quantityNumber * 100);
                    this.editingQuantityType.set('grams');
                }
            }
        }
    }

    onEditingPortionChange(newPortion: string): void {
        this.editingPortion.set(newPortion);

        if (newPortion === '100g') {
            this.editingQuantity.set(100);
            this.editingQuantityType.set('grams');
        } else {
            this.editingQuantity.set(1);
            this.editingQuantityType.set('units');
        }
    }

    onEditingQuantityTypeChange(newType: 'grams' | 'units'): void {
        const oldType = this.editingQuantityType();
        if (oldType === newType) return;

        this.editingQuantityType.set(newType);

        if (newType === 'units') {
            this.editingQuantity.set(1);
        } else {
            this.editingQuantity.set(100);
        }
    }

    async saveEditFood(food: any, index: number): Promise<void> {
        try {
            const portion = this.editingPortion();
            const quantityType = this.editingQuantityType();
            const userQuantity = this.editingQuantity();

            let quantity: number;

            if (portion === '100g' || quantityType === 'grams') {
                quantity = userQuantity / 100;
            } else {
                quantity = userQuantity;
            }

            const updateData: any = {
                quantity: quantity.toString(),
                portion: portion
            };

            await this.foodService.patchFood(this.meal().id, food.id, updateData);

            this.notificationService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Alimento atualizado com sucesso!'
            });

        } catch (error) {
            console.error('Error updating food:', error);
            this.notificationService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao atualizar alimento.'
            });
        } finally {
            this.editingFoodIndex.set(null);
            // Emite para o pai buscar dados atualizados do backend
            this.mealUpdated.emit();
        }
    }

    cancelEditFood(): void {
        this.editingFoodIndex.set(null);
    }
}