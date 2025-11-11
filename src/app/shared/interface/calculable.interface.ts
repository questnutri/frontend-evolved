export interface Calculable {
    getTotal(nutrient: 'kcal' | 'carb' | 'protein' | 'fat'): number;
}