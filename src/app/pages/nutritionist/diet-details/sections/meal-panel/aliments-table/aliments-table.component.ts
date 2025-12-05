import { Component, inject, model, input, OnInit, signal, computed, effect } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { QnTextInputComponent, QnButtonComponent, QnNumberInputComponent } from "@qn/components/basic";
import { TableLazyLoadEvent, TableModule } from "primeng/table";
import { Checkbox } from "primeng/checkbox";
import { AlimentService, FoodService } from '@qn/services';
import { FormsModule } from '@angular/forms';
import { AlimentModel } from '@qn/models';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { PaginatorModule } from 'primeng/paginator';
import { QnLabelDirective } from "@qn/directives";
import { Chip } from "primeng/chip";

@Component({
    selector: 'app-aliments-table',
    templateUrl: './aliments-table.component.html',
    styleUrls: ['./aliments-table.component.scss'],
    imports: [Dialog, QnTextInputComponent, TableModule, Checkbox, QnButtonComponent, FormsModule, CommonModule, SelectModule, QnNumberInputComponent, PaginatorModule, QnLabelDirective, Chip],
})
export class AlimentsTableComponent {
    private readonly alimentService = inject(AlimentService);
    private readonly foodService = inject(FoodService);

    modalAlimentsVisible = model.required<boolean>();
    mealId = input.required<string>();

    selectedPortion = signal<string>('100g');
    selectedQuantity = signal<number>(100);
    selectedQuantityType = signal<'grams' | 'units'>('grams');

    private readonly placeholderAliment = AlimentModel.from({
        _id: 'placeholder-no-selection',
        name: '-',
        availablePortions: ['100g'],
        portions: {
            '100g': { kcal: '0', protein: '0', carb: '0', fat: '0', dietaryFiber: '0', sodium: '0' }
        }
    } as any);

    optionsSource = [
        { label: 'TACO', value: 'taco' },
        { label: 'Medidas Caseiras', value: 'home_measures' },
        { label: 'Todas', value: null }
    ];

    optionsTypeQuantity = [
        { label: 'Gramas (g)', value: 'grams' },
        { label: 'Unidades', value: 'units' }
    ];

    sourceSelected = signal<string | null>(null);
    searchAliment = signal<string>('');
    totalRecords = signal<number>(0);
    loading = signal<boolean>(false);
    firstRow = signal<number>(0);

    aliments = signal<AlimentModel[]>([]);
    alimentSelected = signal<AlimentModel[]>([this.placeholderAliment]);

    constructor() {
        let debounceTimer: any;

        // Effect para busca de alimentos
        effect(() => {
            const query = this.searchAliment();

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.firstRow.set(0);
                this.fetchAliments(1, 20);
            }, 500);
        });

        // Effect para resetar valores quando alimento é selecionado
        effect(() => {
            const currentAliment = this.alimentSelected()[0];
            if (currentAliment) {
                this.selectedPortion.set('100g');
                this.selectedQuantity.set(100);
                this.selectedQuantityType.set('grams');
            }
        }, { allowSignalWrites: true });
    }

    optionsPortion = computed(() => {
        const selectedAliment = this.alimentSelected()[0];
        if (!selectedAliment || selectedAliment._id === 'placeholder-no-selection') {
            return ['100g'];
        }

        if (selectedAliment.source === 'taco') {
            return ['100g'];
        } else {
            return selectedAliment.availablePortions && selectedAliment.availablePortions.length > 0
                ? selectedAliment.availablePortions
                : ['100g'];
        }
    });

    nutrientsPer100g = computed(() => {
        const aliment = this.alimentSelected()[0];

        // Sempre buscar os valores de 100g
        const portionData = aliment.portions ? aliment.portions['100g'] : null;

        if (!portionData) {
            return { kcal: 0, carb: 0, protein: 0, fat: 0, dietaryFiber: 0, sodium: 0 };
        }

        return {
            kcal: this.getNumericValue(portionData['kcal']),
            carb: this.getNumericValue(portionData['carb']),
            protein: this.getNumericValue(portionData['protein']),
            fat: this.getNumericValue(portionData['fat']),
            dietaryFiber: this.getNumericValue(portionData['dietaryFiber']),
            sodium: this.getNumericValue(portionData['sodium']),
        };
    });

    calculateNutrientForSelectedQuantity(valuePerUnit: number): number {
        const quantity = this.selectedQuantity();
        const portion = this.selectedPortion();
        const quantityType = this.selectedQuantityType();
        const aliment = this.alimentSelected()[0];

        if (quantity <= 0) return 0;

        // Se a porção selecionada for 100g, sempre calcula em gramas
        if (portion === '100g') {
            return (valuePerUnit / 100) * quantity;
        }

        // Para outras porções, precisa buscar a proporção
        const portionData = aliment.portions ? aliment.portions[portion] : null;

        if (!portionData || !portionData['proportion']) {
            return (valuePerUnit / 100) * quantity;
        }

        const proportion = this.getNumericValue(portionData['proportion']);

        // Se o tipo for 'gramas', calcula direto em gramas
        if (quantityType === 'grams') {
            return (valuePerUnit / 100) * quantity;
        }

        // Se o tipo for 'units', multiplica pela proporção da porção
        // Ex: Se COL S CH PICADO = 45g, e usuario digita 2 unidades, então 2 * 45g = 90g
        const totalGrams = proportion * quantity;

        return (valuePerUnit / 100) * totalGrams;
    }

    avaliablePortionsOfSelectedAliment = computed(() => {
        const selectedAliment = this.alimentSelected()[0];

        if (!selectedAliment || selectedAliment._id === 'placeholder-no-selection') {
            return [{ label: '100g', value: '100g' }];
        }

        if (!selectedAliment.availablePortions || selectedAliment.availablePortions.length === 0) {
            return [{ label: '100g', value: '100g' }];
        }

        return selectedAliment.availablePortions.map(portionName => {
            const portionData = selectedAliment.portions[portionName];
            const proportion = portionData?.['proportion'] || '100';
            if (portionName === '100g') {
                return {
                    label: portionName,
                    value: portionName
                }
            }
            return {
                label: `${portionName} (${proportion}g)`,
                value: portionName
            };
        });
    });

    sourceAlimentSelectedNormalized = computed(() => {
        const selectedAliment = this.alimentSelected()[0];
        if (!selectedAliment || selectedAliment._id === 'placeholder-no-selection') {
            return 'N/A';
        }
        if (selectedAliment.source === 'taco') {
            return 'TACO';
        } else {
            return 'Medidas Caseiras';
        }
    })

    async loadAliments(event: TableLazyLoadEvent) {
        const first = event.first ?? 0;
        const rows = event.rows ?? 20;
        const page = Math.floor(first / rows) + 1;

        await this.fetchAliments(page, rows);
    }

    private async fetchAliments(page: number, rows: number) {
        this.loading.set(true);

        try {
            const response: any = await this.alimentService.getAliments(
                page.toString(),
                rows.toString(),
                this.searchAliment() || null,
                this.sourceSelected() || null
            );

            const data = response?.aliments;

            if (data && data.items) {
                this.aliments.set(
                    data.items.map((item: any) => AlimentModel.from(item))
                );
                this.totalRecords.set(data.totalItems ?? 0);
            } else {
                this.aliments.set([]);
                this.totalRecords.set(0);
            }

        } catch (error) {
            console.error('Erro ao carregar alimentos', error);
            this.aliments.set([]);
            this.totalRecords.set(0);
        } finally {
            this.loading.set(false);
        }
    }

    getNumericValue(value: string | undefined | number): number {
        if (!value) return 0;
        if (typeof value === 'number') return value;

        const sanitized = value.trim().toUpperCase();
        if (sanitized === 'NA' || sanitized === 'TR' || sanitized === '') return 0;

        return parseFloat(sanitized.replace(',', '.')) || 0;
    }

    isSelected(aliment: AlimentModel): boolean {
        return this.alimentSelected().some(a => a._id === aliment._id);
    }

    toggleSelection(aliment: AlimentModel, checked: boolean) {
        if (checked) {
            this.alimentSelected.set([aliment]);
        } else {
            this.alimentSelected.set([this.placeholderAliment]);
        }
    }

    onQuantityTypeChange(newType: 'grams' | 'units') {
        const oldType = this.selectedQuantityType();

        if (oldType === newType) return;

        this.selectedQuantityType.set(newType);

        // Ajusta o valor da quantidade baseado no novo tipo
        if (newType === 'units') {
            this.selectedQuantity.set(1);
        } else if (newType === 'grams') {
            this.selectedQuantity.set(100);
        }
    }

    onQuantityChange(newQuantity: number | null) {
        // Garante que nunca seja menor que 0.1 e permite decimais
        const validQuantity = Math.max(0.1, newQuantity ?? 0.1);
        this.selectedQuantity.set(validQuantity);
    }

    addAlimentToMeal() {
        const selectedAliment = this.alimentSelected()[0];

        // Validação
        if (!selectedAliment || selectedAliment._id === 'placeholder-no-selection') {
            console.error('Nenhum alimento selecionado');
            return;
        }

        const portion = this.selectedPortion();
        const quantityType = this.selectedQuantityType();
        const userQuantity = this.selectedQuantity();

        let quantity: number;

        // Se for 100g ou tipo gramas, divide por 100
        if (portion === '100g' || quantityType === 'grams') {
            quantity = userQuantity / 100;
        } else {
            // Se for unidades, usa o valor direto
            quantity = userQuantity;
        }

        const payload = {
            mealId: this.mealId(),
            alimentId: selectedAliment._id,
            quantity: quantity.toString(),
            portion: portion,
            description: '' // Pode adicionar um campo de descrição no formulário se necessário
        };

        this.foodService.postFood(payload);

        console.log('Payload para enviar ao backend:', payload);


        return payload;
    }
}