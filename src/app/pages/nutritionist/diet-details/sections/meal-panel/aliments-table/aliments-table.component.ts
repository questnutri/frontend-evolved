import { Component, inject, model, input, OnInit, signal } from '@angular/core';
import { Dialog } from "primeng/dialog";
import { QnTextInputComponent, QnButtonComponent } from "@qn/components/basic";
import { TableModule } from "primeng/table";
import { Checkbox } from "primeng/checkbox";
import { AlimentService } from '@qn/services';
import { FormsModule } from '@angular/forms';
import { AlimentModel } from '@qn/models';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-aliments-table',
    templateUrl: './aliments-table.component.html',
    styleUrls: ['./aliments-table.component.scss'],
    imports: [Dialog, QnTextInputComponent, TableModule, Checkbox, QnButtonComponent, FormsModule, CommonModule],
})
export class AlimentsTableComponent implements OnInit {
    private readonly alimentService = inject(AlimentService);

    modalAlimentsVisible = model.required<boolean>();
    mealId = input.required<string>();

    aliments = signal<AlimentModel[]>([]);
    alimentSelected = signal<AlimentModel[]>([]); // Array com no máximo 1 elemento

    constructor() {
        this.loadAliments();
    }

    async loadAliments() {
        const aliments = await this.alimentService.getAliments();
        this.aliments.set(aliments?.map(aliment => AlimentModel.from(aliment)) || []);
        console.log(this.aliments());
    }

    getNumericValue(value: string | undefined): number {
        if (!value || value === 'NA' || value === 'Tr' || value === '') {
            return 0;
        }
        // Substitui vírgula por ponto e converte para número
        return parseFloat(value.replace(',', '.'));
    }

    isSelected(aliment: AlimentModel): boolean {
        return this.alimentSelected().some(a => a._id === aliment._id);
    }

    toggleSelection(aliment: AlimentModel, checked: boolean) {
        if (checked) {
            // Substitui o alimento anterior pelo novo (array sempre terá 1 elemento)
            this.alimentSelected.set([aliment]);
        } else {
            // Remove o alimento (array fica vazio)
            this.alimentSelected.set([]);
        }
        console.log('Alimento selecionado:', this.alimentSelected());
    }

    ngOnInit() { }


}

