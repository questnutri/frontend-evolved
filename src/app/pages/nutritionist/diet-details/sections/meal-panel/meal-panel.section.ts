import { Component, computed, input, OnInit, output, signal } from '@angular/core';
import { DatePicker } from "primeng/datepicker";
import { FormsModule } from '@angular/forms';
import { Select } from "primeng/select";
import { QnNumberInputComponent, QnButtonComponent, QnTextInputComponent } from "@qn/components/basic";
import { QnLabelDirective } from "@qn/directives";
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { MealModel } from '@qn/models';
import { th } from 'date-fns/locale';

@Component({
    selector: 'app-meal-panel',
    templateUrl: './meal-panel.section.html',
    styleUrls: ['./meal-panel.section.scss'],
    imports: [DatePicker, FormsModule, Select, QnNumberInputComponent, QnButtonComponent, QnTextInputComponent, QnLabelDirective, DividerModule, AccordionModule],
})
export class MealPanelSection implements OnInit {
    meal = input.required<MealModel>();
    startDate = signal<Date | null>(null);
    valueRepeat = signal<string>('ONCE');
    optionRepeatConfiguration = [
        { label: 'Nunca', value: 'ONCE' },
        { label: 'Diariamente', value: 'DAILY' },
        { label: 'Semanalmente', value: 'WEEKLY' },
        { label: 'Mensalmente', value: 'MONTHLY' },
    ]
    weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    selectedDays = signal<number[]>([]);
    selectedMonthDates = signal<Date[]>([new Date(2024, 11, 1)]);
    interval = signal<number>(1);
    closeEditMeal = output<void>();
    minViewDate = signal<Date>(new Date(2024, 11, 1));
    maxViewDate = signal<Date>(new Date(2025, 0, 1));
    showRepeatConfig = signal<boolean>(false);
    hour = signal<Date>(new Date());
    editMeal = signal<MealModel | null>(null);
    mealName = signal<string>('');

    haveChangedValue = computed(() => {
        const meal = this.meal();
        const editMeal = this.editMeal();


        return this.meal().name !== this.mealName();
    });

    ngOnInit() {
        this.editMeal.set(MealModel.from(this.meal()));
        if (this.meal().name) {

            this.mealName.set(this.meal().name!);
        }
    }

    teste() {
        console.log(this.editMeal());
    }

    toggleDayOfWeeks(dayIndex: number) {
        this.selectedDays.update(days => {
            if (days.includes(dayIndex)) {
                return days.filter(d => d !== dayIndex);
            } else {
                return [...days, dayIndex].sort((a, b) => a - b);
            }
        });
    }

    selectedMonthDays = computed(() => {
        return this.selectedMonthDates()
            .map(date => date.getDate())
            .sort((a, b) => a - b);
    });

    saveRepeatConfiguration() {
        alert('Configuração de repetição salva!');
    }

    showRepeatConfiguration() {
        this.showRepeatConfig.update(show => !show);
    }

    textFrequency = computed(() => {

        if (this.valueRepeat() === 'DAILY') {
            return {
                value1: 'Repetir a cada',
                value2: `dia(s)`
            }
        } else if (this.valueRepeat() === 'WEEKLY') {
            return {
                value1: 'Acontece a cada',
                value2: `semana(s)`
            }
        } else if (this.valueRepeat() === 'MONTHLY') {
            return {
                value1: 'Acontece a cada',
                value2: `mês(es)`
            }
        } else {
            return {
                value1: '',
                value2: ''
            }
        }
    });

    summaryRepeatConfiguration = computed(() => {
        const repeatiConfiguration = this.meal().repeatConfiguration

        if (repeatiConfiguration.type == 'ONCE') {
            return 'Não se repete';
        }

        if (repeatiConfiguration.type == 'DAILY') {
            return `Refeicao acontece diariamente a cada ${repeatiConfiguration.repeatTarget} dia(s)`;
        }
        if (repeatiConfiguration.type == 'WEEKLY') {
            return `Refeicao acontece semanalmente a cada ${repeatiConfiguration.repeatTarget} semana(s)`;
        }
        if (repeatiConfiguration.type == 'MONTHLY') {
            return `Refeicao acontece mensalmente a cada ${repeatiConfiguration.repeatTarget} mês(es)`;
        }

        return '';
    });
}
