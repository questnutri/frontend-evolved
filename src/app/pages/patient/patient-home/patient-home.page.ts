import { Component, signal } from '@angular/core';
import { MealCardState, MealDisplayComponent } from "src/app/shared/components/core/qn-meal/qn-meal-display";

@Component({
    selector: 'app-patient-home',
    imports: [MealDisplayComponent],
    templateUrl: './patient-home.page.html',
    styleUrl: './patient-home.page.scss',
})
export class PatientHomePage {

    meals = signal<MealCardState[]>([
        {
            isActive: true,
            id: "b51d708e-c8fb-418a-aef1-f84ddb219702",
            name: "Breakfast",
            repeatConfiguration: {
                type: "DAILY",
                interval: 1,
                daysOfWeek: [1, 2, 3, 4, 5]
            },
            hour: "08:00",
            validFrom: "2025-11-07T00:00:00.000Z",
            validTo: null,
            createdAt: "2025-11-07T13:20:00.962Z",
            updatedAt: "2025-11-07T13:20:00.962Z",
            checked: true,
            expanded: false,
            foods: [
                {
                    isActive: true,
                    id: "f09dd141-b328-4522-a1b5-d3609c7c5850",
                    quantity: "3",
                    portion: "100 grams",
                    description: null,
                    validFrom: "2025-11-07T00:00:00.000Z",
                    validTo: null,
                    createdAt: "2025-11-07T13:23:08.350Z",
                    updatedAt: "2025-11-07T13:23:08.350Z",
                    aliment: {
                        source: "taco",
                        _id: "690a9c00ed4bab410f4b1725",
                        name: "Ovos mexidos",
                        availablePortions: ["100 grams"],
                        portions: {
                            "100 grams": {
                                alimentGroup: "Ovos e derivados",
                                kcal: "154",
                                kJ: "644",
                                carb: "1.6",
                                protein: "10.9",
                                fat: "11.5",
                                humidity: "73.8",
                                dietaryFiber: "0",
                                cholesterol: "353",
                                sodium: "138",
                                calcium: "56",
                                magnesium: "12",
                                manganese: "0.03",
                                phosphorus: "180",
                                iron: "1.8",
                                potassium: "138",
                                copper: "0.08",
                                zinc: "1.1",
                                retinol: "NA",
                                RE: "",
                                RAE: "",
                                thiamine: "0.07",
                                riboflavin: "0.38",
                                pyridoxine: "0.12",
                                niacin: "0.1",
                                vitaminC: "",
                                ash: "1.2"
                            }
                        }
                    }
                },
                {
                    isActive: true,
                    id: "a12bc789-def0-1234-5678-abcdef123456",
                    quantity: "2",
                    portion: "100 grams",
                    description: null,
                    validFrom: "2025-11-07T00:00:00.000Z",
                    validTo: null,
                    createdAt: "2025-11-07T13:23:08.350Z",
                    updatedAt: "2025-11-07T13:23:08.350Z",
                    aliment: {
                        source: "taco",
                        _id: "690a9c00ed4bab410f4b1726",
                        name: "Pão integral",
                        availablePortions: ["100 grams"],
                        portions: {
                            "100 grams": {
                                alimentGroup: "Cereais e derivados",
                                kcal: "253",
                                kJ: "1058",
                                carb: "49.0",
                                protein: "9.4",
                                fat: "3.5",
                                humidity: "35.0",
                                dietaryFiber: "6.9",
                                cholesterol: "0",
                                sodium: "489",
                                calcium: "57",
                                magnesium: "70",
                                manganese: "1.8",
                                phosphorus: "183",
                                iron: "2.5",
                                potassium: "208",
                                copper: "0.2",
                                zinc: "1.7",
                                retinol: "NA",
                                RE: "",
                                RAE: "",
                                thiamine: "0.29",
                                riboflavin: "0.06",
                                pyridoxine: "0.15",
                                niacin: "3.5",
                                vitaminC: "",
                                ash: "2.1"
                            }
                        }
                    }
                }
            ]
        },
        {
            isActive: true,
            id: "c62e819f-d9gb-529b-bef2-g95eec330813",
            name: "Lunch",
            repeatConfiguration: {
                type: "DAILY",
                interval: 1,
                daysOfWeek: [1, 2, 3, 4, 5]
            },
            hour: "13:00",
            validFrom: "2025-11-07T00:00:00.000Z",
            validTo: null,
            createdAt: "2025-11-07T13:20:00.962Z",
            updatedAt: "2025-11-07T13:20:00.962Z",
            checked: false,
            expanded: false,
            foods: [
                {
                    isActive: true,
                    id: "g10ee252-c439-5633-b2c6-e4710d8d8961",
                    quantity: "1",
                    portion: "100 grams",
                    description: null,
                    validFrom: "2025-11-07T00:00:00.000Z",
                    validTo: null,
                    createdAt: "2025-11-07T13:23:08.350Z",
                    updatedAt: "2025-11-07T13:23:08.350Z",
                    aliment: {
                        source: "taco",
                        _id: "690a9c00ed4bab410f4b1725",
                        name: "Arroz, integral, cru",
                        availablePortions: ["100 grams"],
                        portions: {
                            "100 grams": {
                                alimentGroup: "Cereais e derivados",
                                kcal: "359,678002",
                                kJ: "1504,892761",
                                carb: "77,45071413",
                                protein: "7,32328587",
                                fat: "1,864833333",
                                humidity: "12,17983333",
                                dietaryFiber: "4,819166667",
                                cholesterol: "NA",
                                sodium: "1,645666667",
                                calcium: "7,818",
                                magnesium: "109,71",
                                manganese: "2,993333333",
                                phosphorus: "250,865",
                                iron: "0,948333333",
                                potassium: "173,34",
                                copper: "0,074833333",
                                zinc: "1,395166667",
                                retinol: "NA",
                                RE: "",
                                RAE: "",
                                thiamine: "0,261666667",
                                riboflavin: "Tr",
                                pyridoxine: "0,175",
                                niacin: "4,183333333",
                                vitaminC: "",
                                ash: "1,181333333"
                            }
                        }
                    }
                },
                {
                    isActive: true,
                    id: "h21ff363-d540-6744-c3d7-f5821e9e9072",
                    quantity: "1.5",
                    portion: "100 grams",
                    description: null,
                    validFrom: "2025-11-07T00:00:00.000Z",
                    validTo: null,
                    createdAt: "2025-11-07T13:23:08.350Z",
                    updatedAt: "2025-11-07T13:23:08.350Z",
                    aliment: {
                        source: "taco",
                        _id: "690a9c00ed4bab410f4b1727",
                        name: "Peito de frango grelhado",
                        availablePortions: ["100 grams"],
                        portions: {
                            "100 grams": {
                                alimentGroup: "Carnes e derivados",
                                kcal: "165",
                                kJ: "690",
                                carb: "0",
                                protein: "31.0",
                                fat: "3.6",
                                humidity: "64.5",
                                dietaryFiber: "0",
                                cholesterol: "85",
                                sodium: "77",
                                calcium: "15",
                                magnesium: "29",
                                manganese: "0.02",
                                phosphorus: "228",
                                iron: "0.9",
                                potassium: "256",
                                copper: "0.05",
                                zinc: "1.0",
                                retinol: "NA",
                                RE: "",
                                RAE: "",
                                thiamine: "0.08",
                                riboflavin: "0.12",
                                pyridoxine: "0.6",
                                niacin: "11.6",
                                vitaminC: "",
                                ash: "1.2"
                            }
                        }
                    }
                }
            ]
        },
        {
            isActive: true,
            id: "d73f920g-e0hc-630c-cfg3-h06ffd441924",
            name: "Dinner",
            repeatConfiguration: {
                type: "WEEKLY",
                interval: 1,
                daysOfWeek: [1, 2]
            },
            hour: "19:00",
            validFrom: "2025-11-07T00:00:00.000Z",
            validTo: null,
            createdAt: "2025-11-07T13:20:00.962Z",
            updatedAt: "2025-11-07T13:20:00.962Z",
            checked: false,
            expanded: false,
            foods: [
                {
                    isActive: true,
                    id: "i32gg474-e651-7855-d4e8-g6932f0f0183",
                    quantity: "1",
                    portion: "100 grams",
                    description: null,
                    validFrom: "2025-11-07T00:00:00.000Z",
                    validTo: null,
                    createdAt: "2025-11-07T13:23:08.350Z",
                    updatedAt: "2025-11-07T13:23:08.350Z",
                    aliment: {
                        source: "taco",
                        _id: "690a9c00ed4bab410f4b1728",
                        name: "Salmão assado",
                        availablePortions: ["100 grams"],
                        portions: {
                            "100 grams": {
                                alimentGroup: "Pescados",
                                kcal: "208",
                                kJ: "870",
                                carb: "0",
                                protein: "25.4",
                                fat: "12.4",
                                humidity: "61.2",
                                dietaryFiber: "0",
                                cholesterol: "63",
                                sodium: "59",
                                calcium: "12",
                                magnesium: "29",
                                manganese: "0.02",
                                phosphorus: "252",
                                iron: "0.8",
                                potassium: "363",
                                copper: "0.05",
                                zinc: "0.6",
                                retinol: "NA",
                                RE: "",
                                RAE: "",
                                thiamine: "0.23",
                                riboflavin: "0.38",
                                pyridoxine: "0.8",
                                niacin: "8.5",
                                vitaminC: "",
                                ash: "1.3"
                            }
                        }
                    }
                }
            ]
        },
        {
            isActive: true,
            id: "e84g031h-f1id-741d-dgh4-i17ggf552035",
            name: "Morning Snack",
            repeatConfiguration: {
                type: "DAILY",
                interval: 1,
                daysOfWeek: [1, 2, 3, 4, 5]
            },
            hour: "10:30",
            validFrom: "2025-11-07T00:00:00.000Z",
            validTo: null,
            createdAt: "2025-11-07T13:20:00.962Z",
            updatedAt: "2025-11-07T13:20:00.962Z",
            checked: true,
            expanded: false,
            foods: []
        }
    ]);
}
