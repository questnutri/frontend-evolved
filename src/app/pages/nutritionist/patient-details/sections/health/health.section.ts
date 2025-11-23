import { Component, OnInit } from '@angular/core';
import { QnButtonComponent } from "@qn/components/basic";

@Component({
    selector: 'nutritionist-patient-health',
    templateUrl: './health.section.html',
    styleUrls: ['./health.section.scss'],
    imports: [QnButtonComponent],
})
export class NutritionistPatientHealthSection implements OnInit {

    constructor() { }

    ngOnInit() { }

    healthMetrics = [
        { label: 'Peso Atual', value: '63Kg', observation: '+7Kg esse mês' },
        { label: 'IMC', value: '23.5', observation: 'Faixa Normal' },
        { label: 'Objetivo de Peso', value: '69Kg', observation: '+6Kg para o objetivo' },
    ]
    recentMeasurements = [
        { label: 'Peso', value: '62Kg', date: '11-11-2025' },
        { label: 'Peso', value: '61.5Kg', date: '25-10-2025' },
        { label: 'Peso', value: '60Kg', date: '23-9-2025' },
    ]
}
