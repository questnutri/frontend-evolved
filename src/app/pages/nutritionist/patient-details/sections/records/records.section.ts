import { Component, OnInit, inject, signal, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { WeightService } from 'src/app/services/weight/weight.service';
import { WaterService } from '@qn/services';
import { WeightRecord } from 'src/app/shared/interface/weight.interface';
import { WaterDayResponse } from '@qn/models';
import { MealRecordService, MealRecordResponse, DailyMealBreakdown } from 'src/app/services/meal-record/meal-record.service';


interface WeekWaterData {
    date: Date;
    dayName: string;
    intake: number;
    goal: number;
    percentage: number;
}

interface WeekMealData {
    date: Date;
    dayName: string;
    expectedMeals: number;
    completedMeals: number;
    completionRate: number;
}

interface WeightStats {
    current: number | null;
    initial: number | null;
    lowest: number | null;
    highest: number | null;
    average: number | null;
    totalChange: number | null;
    changeDirection: 'up' | 'down' | 'stable';
}

interface WaterStats {
    todayIntake: number;
    todayGoal: number;
    weekAverage: number;
    weekTotal: number;
    completedDays: number;
    totalDaysTracked: number;
    averagePercentage: number;
}

interface MealStats {
    todayExpected: number;
    todayCompleted: number;
    todayCompletionRate: number;
    weekExpected: number;
    weekCompleted: number;
    weekCompletionRate: number;
    totalExpected: number;
    totalCompleted: number;
    totalCompletionRate: number;
    streakDays: number;
    bestDay: { date: string; rate: number } | null;
}

@Component({
    selector: 'nutritionist-patient-records',
    templateUrl: './records.section.html',
    styleUrls: ['./records.section.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        SelectButtonModule,
        CardModule,
        ProgressBarModule
    ]
})
export class NutritionistPatientRecordsSection implements OnInit {
    private readonly weightService = inject(WeightService);
    private readonly waterService = inject(WaterService);
    private readonly mealRecordService = inject(MealRecordService);

    // Expose Math to template
    Math = Math;

    patientId = input.required<string>();

    // Patient creation date (when they joined)
    patientCreatedAt = input<string | Date>();

    // Loading states
    loadingWeight = signal(false);
    loadingWater = signal(false);
    loadingMeals = signal(false);

    // Weight data
    weights = signal<WeightRecord[]>([]);
    selectedWeightRange = signal<string>('3months');

    // Water data
    todayWaterData = signal<WaterDayResponse | null>(null);
    weekWaterData = signal<WeekWaterData[]>([]);
    monthWaterData = signal<{ date: string; intake: number; goal: number }[]>([]);

    // Meal data
    mealRecordData = signal<MealRecordResponse | null>(null);
    weekMealData = signal<WeekMealData[]>([]);
    monthMealData = signal<DailyMealBreakdown[]>([]);

    // Time range options
    weightRangeOptions = [
        { label: '1M', value: '1month' },
        { label: '3M', value: '3months' },
        { label: '6M', value: '6months' },
        { label: '1A', value: '1year' },
        { label: 'Tudo', value: 'all' }
    ];

    // Chart options
    weightChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' as const },
                bodyFont: { size: 13 },
                callbacks: {
                    label: (context: any) => `Peso: ${context.parsed.y.toFixed(1)} kg`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } }
            },
            y: {
                beginAtZero: false,
                ticks: {
                    font: { size: 11 },
                    callback: (value: any) => `${value} kg`
                },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const
        }
    };

    waterChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' as const },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                callbacks: {
                    label: (context: any) => `${context.dataset.label}: ${context.parsed.y} ml`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: { size: 11 },
                    callback: (value: any) => `${value} ml`
                },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
        }
    };

    waterWeekBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 12, weight: 'bold' as const } }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: { size: 11 },
                    callback: (value: any) => `${value} ml`
                },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
        }
    };

    mealWeekBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' as const },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 12, weight: 'bold' as const } }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: { size: 11 },
                    stepSize: 1
                },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
        }
    };

    mealTrendChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                callbacks: {
                    label: (context: any) => `Taxa de conclusão: ${context.parsed.y}%`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 } }
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    font: { size: 11 },
                    callback: (value: any) => `${value}%`
                },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
        }
    };

    // Computed: Weight statistics
    weightStats = computed<WeightStats>(() => {
        const data = this.weights();
        if (data.length === 0) {
            return {
                current: null,
                initial: null,
                lowest: null,
                highest: null,
                average: null,
                totalChange: null,
                changeDirection: 'stable'
            };
        }

        const sorted = [...data].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        const values = sorted.map(w => parseFloat(w.valueInKg));
        const current = values[values.length - 1];
        const initial = values[0];
        const totalChange = current - initial;

        return {
            current,
            initial,
            lowest: Math.min(...values),
            highest: Math.max(...values),
            average: values.reduce((a, b) => a + b, 0) / values.length,
            totalChange,
            changeDirection: totalChange > 0.1 ? 'up' : totalChange < -0.1 ? 'down' : 'stable'
        };
    });

    // Computed: Filtered weights by range
    filteredWeights = computed(() => {
        const range = this.selectedWeightRange();
        const now = new Date();

        return this.weights().filter(weight => {
            if (range === 'all') return true;

            const weightDate = new Date(weight.createdAt);
            const daysDiff = (now.getTime() - weightDate.getTime()) / (1000 * 60 * 60 * 24);

            switch (range) {
                case '1month': return daysDiff <= 30;
                case '3months': return daysDiff <= 90;
                case '6months': return daysDiff <= 180;
                case '1year': return daysDiff <= 365;
                default: return true;
            }
        });
    });

    // Computed: Weight chart data
    weightChartData = computed(() => {
        const filtered = [...this.filteredWeights()].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        const labels = filtered.map(w => {
            const date = new Date(w.createdAt);
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        });

        const data = filtered.map(w => parseFloat(w.valueInKg));
        const trendLine = this.calculateTrendLine(data);

        return {
            labels,
            datasets: [
                {
                    label: 'Peso',
                    data,
                    fill: true,
                    borderColor: '#F97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    tension: 0.4,
                    pointBackgroundColor: '#F97316',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Tendência',
                    data: trendLine,
                    fill: false,
                    borderColor: 'rgba(249, 115, 22, 0.4)',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0
                }
            ]
        };
    });

    // Computed: Water statistics
    waterStats = computed<WaterStats>(() => {
        const today = this.todayWaterData();
        const week = this.weekWaterData();

        const todayIntake = today?.totalIntake || 0;
        const todayGoal = parseInt(today?.currentDailyWaterGoal || '2000');

        const totalDaysTracked = this.calculateDaysTracked(7);
        const relevantDays = this.getRelevantDays(week);

        const weekTotal = relevantDays.reduce((acc, d) => acc + d.intake, 0);
        const weekAverage = relevantDays.length > 0 ? weekTotal / relevantDays.length : 0;
        const completedDays = relevantDays.filter(d => d.percentage >= 100).length;
        const averagePercentage = relevantDays.length > 0
            ? relevantDays.reduce((acc, d) => acc + d.percentage, 0) / relevantDays.length
            : 0;

        return {
            todayIntake,
            todayGoal,
            weekAverage,
            weekTotal,
            completedDays,
            totalDaysTracked,
            averagePercentage
        };
    });

    // Computed: Meal statistics
    mealStats = computed<MealStats>(() => {
        const data = this.mealRecordData();
        const weekData = this.weekMealData();
        const today = new Date().toISOString().split('T')[0];

        if (!data) {
            return {
                todayExpected: 0,
                todayCompleted: 0,
                todayCompletionRate: 0,
                weekExpected: 0,
                weekCompleted: 0,
                weekCompletionRate: 0,
                totalExpected: 0,
                totalCompleted: 0,
                totalCompletionRate: 0,
                streakDays: 0,
                bestDay: null
            };
        }

        // Today's stats
        const todayData = data.dailyBreakdown.find(d => d.date === today);
        const todayExpected = todayData?.expectedMeals || 0;
        const todayCompleted = todayData?.completedMeals || 0;
        const todayCompletionRate = todayData?.completionRate || 0;

        // Week stats
        const weekExpected = weekData.reduce((acc, d) => acc + d.expectedMeals, 0);
        const weekCompleted = weekData.reduce((acc, d) => acc + d.completedMeals, 0);
        const weekCompletionRate = weekExpected > 0 ? Math.round((weekCompleted / weekExpected) * 100) : 0;

        // Calculate streak (consecutive days with 100% completion)
        const streakDays = this.calculateMealStreak(data.dailyBreakdown);

        // Find best day
        const daysWithMeals = data.dailyBreakdown.filter(d => d.expectedMeals > 0 && d.completionRate > 0);
        const bestDay = daysWithMeals.length > 0
            ? daysWithMeals.reduce((best, current) =>
                current.completionRate > best.completionRate ? current : best
            )
            : null;

        return {
            todayExpected,
            todayCompleted,
            todayCompletionRate,
            weekExpected,
            weekCompleted,
            weekCompletionRate,
            totalExpected: data.summary.totalExpectedMeals,
            totalCompleted: data.summary.completedMeals,
            totalCompletionRate: data.summary.completionRate,
            streakDays,
            bestDay: bestDay ? { date: bestDay.date, rate: bestDay.completionRate } : null
        };
    });

    // Computed: Meal week chart data
    mealWeekChartData = computed(() => {
        const week = this.weekMealData();

        return {
            labels: week.map(d => d.dayName),
            datasets: [
                {
                    label: 'Concluídas',
                    data: week.map(d => d.completedMeals),
                    backgroundColor: '#22C55E',
                    borderRadius: 8,
                    borderSkipped: false
                },
                {
                    label: 'Esperadas',
                    data: week.map(d => d.expectedMeals),
                    backgroundColor: '#E5E7EB',
                    borderRadius: 8,
                    borderSkipped: false
                }
            ]
        };
    });

    // Computed: Meal month trend chart data
    mealMonthChartData = computed(() => {
        const month = this.monthMealData();

        return {
            labels: month.map(d => {
                const date = new Date(d.date);
                return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            }),
            datasets: [
                {
                    label: 'Taxa de Conclusão',
                    data: month.map(d => d.completionRate),
                    fill: true,
                    borderColor: '#22C55E',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 5
                }
            ]
        };
    });

    // Computed: Filtered water data by range
    filteredWaterData = computed(() => {
        const range = this.selectedWeightRange();
        const now = new Date();

        return this.weekWaterData().filter(data => {
            if (range === 'all') return true;

            const dataDate = new Date(data.date);
            const daysDiff = (now.getTime() - dataDate.getTime()) / (1000 * 60 * 60 * 24);

            switch (range) {
                case '1month': return daysDiff <= 30;
                case '3months': return daysDiff <= 90;
                case '6months': return daysDiff <= 180;
                case '1year': return daysDiff <= 365;
                default: return true;
            }
        });
    });

    // Computed: Water week chart data
    waterWeekChartData = computed(() => {
        const week = this.weekWaterData();

        return {
            labels: week.map(d => d.dayName),
            datasets: [
                {
                    label: 'Consumo',
                    data: week.map(d => d.intake),
                    backgroundColor: week.map(d => this.getWaterColor(d.percentage)),
                    borderRadius: 8,
                    borderSkipped: false
                }
            ]
        };
    });

    // Computed: Water month chart data
    waterMonthChartData = computed(() => {
        const month = this.monthWaterData();

        return {
            labels: month.map(d => {
                const date = new Date(d.date);
                return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            }),
            datasets: [
                {
                    label: 'Consumo',
                    data: month.map(d => d.intake),
                    fill: true,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 5
                },
                {
                    label: 'Meta',
                    data: month.map(d => d.goal),
                    fill: false,
                    borderColor: 'rgba(34, 197, 94, 0.6)',
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0
                }
            ]
        };
    });

    // Computed: Recent weights for history
    recentWeights = computed(() => {
        return [...this.weights()]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 15);
    });

    parseFloat = parseFloat;

    async ngOnInit() {
        await Promise.all([
            this.loadMealData(),
            this.loadWeightData(),
            this.loadWaterData()
        ]);
    }

    async loadWeightData() {
        this.loadingWeight.set(true);
        try {
            const response = await this.weightService.getAllByPatient(this.patientId());
            this.weights.set(response.items);
        } catch (error) {
            console.error('Failed to load weight data:', error);
        } finally {
            this.loadingWeight.set(false);
        }
    }

    async loadWaterData() {
        this.loadingWater.set(true);
        try {
            const today = new Date();
            const startDate = new Date(today);
            startDate.setDate(today.getDate() - 29);

            const allWaterData = await this.waterService.getWaterRecordsByRangeAndPatient(
                startDate.toISOString().split('T')[0],
                today.toISOString().split('T')[0],
                this.patientId()
            );

            this.processWaterData(allWaterData, today);
        } catch (error) {
            console.error('Failed to load water data:', error);
            this.todayWaterData.set(null);
            this.weekWaterData.set([]);
            this.monthWaterData.set([]);
        } finally {
            this.loadingWater.set(false);
        }
    }

    async loadMealData() {
        this.loadingMeals.set(true);
        try {
            const today = new Date();
            const startDate = new Date(today);
            startDate.setDate(today.getDate() - 29);

            const mealData = await this.mealRecordService.getByPatientAndRange(
                this.patientId(),
                startDate.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );

            this.mealRecordData.set(mealData);
            this.processMealData(mealData, today);
        } catch (error) {
            console.error('Failed to load meal data:', error);
            this.mealRecordData.set(null);
            this.weekMealData.set([]);
            this.monthMealData.set([]);
        } finally {
            this.loadingMeals.set(false);
        }
    }

    private processMealData(data: MealRecordResponse, today: Date) {
        const todayStr = today.toISOString().split('T')[0];
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

        // Create a map for quick lookup
        const mealByDate = new Map<string, DailyMealBreakdown>();
        data.dailyBreakdown.forEach(day => {
            mealByDate.set(day.date, day);
        });

        // Build week data
        const weekDays: WeekMealData[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = dateStr === todayStr;

            const dayData = mealByDate.get(dateStr);

            weekDays.push({
                date,
                dayName: isToday ? 'Hoje' : dayNames[i],
                expectedMeals: dayData?.expectedMeals || 0,
                completedMeals: dayData?.completedMeals || 0,
                completionRate: dayData?.completionRate || 0
            });
        }
        this.weekMealData.set(weekDays);

        // Build month data (last 30 days)
        const monthData: DailyMealBreakdown[] = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = mealByDate.get(dateStr);
            monthData.push(dayData || {
                date: dateStr,
                expectedMeals: 0,
                completedMeals: 0,
                incompleteMeals: 0,
                completionRate: 0,
                records: []
            });
        }
        this.monthMealData.set(monthData);
    }

    private calculateMealStreak(dailyBreakdown: DailyMealBreakdown[]): number {
        const today = new Date().toISOString().split('T')[0];
        const sortedDays = [...dailyBreakdown]
            .filter(d => d.date <= today && d.expectedMeals > 0)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        let streak = 0;
        for (const day of sortedDays) {
            if (day.completionRate === 100) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }

    private processWaterData(data: any, today: Date) {
        const todayStr = today.toISOString().split('T')[0];
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

        const waterByDate = new Map<string, { totalIntake: number; currentDailyWaterGoal: string }>();

        if (Array.isArray(data)) {
            data.forEach((item: any) => {
                const dateKey = item.relativeDate
                    ? new Date(item.relativeDate).toISOString().split('T')[0]
                    : item.date;
                waterByDate.set(dateKey, {
                    totalIntake: item.totalIntake || 0,
                    currentDailyWaterGoal: item.currentDailyWaterGoal || '2000'
                });
            });
        } else if (data?.items && Array.isArray(data.items)) {
            const aggregated = new Map<string, { total: number; goal: string }>();
            data.items.forEach((record: any) => {
                const dateKey = record.relativeDate
                    ? new Date(record.relativeDate).toISOString().split('T')[0]
                    : new Date(record.createdAt).toISOString().split('T')[0];

                const existing = aggregated.get(dateKey) || { total: 0, goal: record.currentDailyWaterGoal || '2000' };
                const amount = parseFloat(record.amountInMl) || 0;

                if (record.operation === 'SUBTRACT' || record.operation === 'subtract') {
                    existing.total -= amount;
                } else {
                    existing.total += amount;
                }
                existing.total = Math.max(0, existing.total);
                aggregated.set(dateKey, existing);
            });

            aggregated.forEach((value, key) => {
                waterByDate.set(key, {
                    totalIntake: value.total,
                    currentDailyWaterGoal: value.goal
                });
            });
        } else if (data?.totalIntake !== undefined) {
            waterByDate.set(todayStr, {
                totalIntake: data.totalIntake || 0,
                currentDailyWaterGoal: data.currentDailyWaterGoal || '2000'
            });
        }

        const todayData = waterByDate.get(todayStr);
        if (todayData) {
            this.todayWaterData.set({
                totalIntake: todayData.totalIntake,
                currentDailyWaterGoal: todayData.currentDailyWaterGoal
            } as WaterDayResponse);
        } else {
            this.todayWaterData.set(null);
        }

        const weekDays: WeekWaterData[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = dateStr === todayStr;

            const dayData = waterByDate.get(dateStr);
            const intake = dayData?.totalIntake || 0;
            const goal = parseInt(dayData?.currentDailyWaterGoal || '2000');
            const percentage = goal > 0 ? Math.min(Math.round((intake / goal) * 100), 100) : 0;

            weekDays.push({
                date,
                dayName: isToday ? 'Hoje' : dayNames[i],
                intake,
                goal,
                percentage
            });
        }
        this.weekWaterData.set(weekDays);

        const monthData: { date: string; intake: number; goal: number }[] = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayData = waterByDate.get(dateStr);
            monthData.push({
                date: dateStr,
                intake: dayData?.totalIntake || 0,
                goal: parseInt(dayData?.currentDailyWaterGoal || '2000')
            });
        }
        this.monthWaterData.set(monthData);
    }

    calculateTrendLine(data: number[]): number[] {
        if (data.length < 2) return data;

        const n = data.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = data.reduce((a, b) => a + b, 0);
        const sumXY = data.reduce((acc, y, x) => acc + x * y, 0);
        const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        return data.map((_, i) => intercept + slope * i);
    }

    getWaterColor(percentage: number): string {
        if (percentage >= 100) return '#22C55E';
        if (percentage >= 75) return '#3B82F6';
        if (percentage >= 50) return '#EAB308';
        return '#EF4444';
    }

    getMealColor(percentage: number): string {
        if (percentage >= 100) return '#22C55E';
        if (percentage >= 75) return '#3B82F6';
        if (percentage >= 50) return '#EAB308';
        return '#EF4444';
    }

    getMealProgressRingStyle(percentage: number): string {
        const color = this.getMealColor(percentage);
        const angle = Math.min(percentage, 100) * 3.6;
        return `conic-gradient(${color} ${angle}deg, #e5e7eb ${angle}deg)`;
    }

    getTodayWaterPercentage(): number {
        const stats = this.waterStats();
        if (stats.todayGoal === 0) return 0;
        return (stats.todayIntake / stats.todayGoal) * 100;
    }

    getWeightDiff(index: number): number {
        const weights = this.recentWeights();
        if (index >= weights.length - 1) return 0;
        return parseFloat(weights[index].valueInKg) - parseFloat(weights[index + 1].valueInKg);
    }

    getProgressRingStyle(percentage: number): string {
        const color = this.getWaterColor(percentage);
        const angle = Math.min(percentage, 100) * 3.6;
        return `conic-gradient(${color} ${angle}deg, #e5e7eb ${angle}deg)`;
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    formatWeight(value: number | null): string {
        if (value === null) return '--';
        return value.toFixed(1);
    }

    formatWaterMl(value: number): string {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}L`;
        }
        return `${Math.round(value)}ml`;
    }

    getChangeClass(direction: string): string {
        switch (direction) {
            case 'up': return 'trend-up';
            case 'down': return 'trend-down';
            default: return 'trend-stable';
        }
    }

    getChangeIcon(direction: string): string {
        switch (direction) {
            case 'up': return 'pi pi-arrow-up';
            case 'down': return 'pi pi-arrow-down';
            default: return 'pi pi-minus';
        }
    }

    private calculateDaysTracked(maxDays: number): number {
        const createdAt = this.patientCreatedAt();
        if (!createdAt) return maxDays;

        const joinDate = new Date(createdAt);
        const today = new Date();

        joinDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = today.getTime() - joinDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        return Math.min(diffDays, maxDays);
    }

    private getRelevantDays(weekData: WeekWaterData[]): WeekWaterData[] {
        const createdAt = this.patientCreatedAt();
        if (!createdAt) return weekData;

        const joinDate = new Date(createdAt);
        joinDate.setHours(0, 0, 0, 0);

        return weekData.filter(day => {
            const dayDate = new Date(day.date);
            dayDate.setHours(0, 0, 0, 0);
            return dayDate >= joinDate;
        });
    }

    getDaysTrackedText(): string {
        const stats = this.waterStats();
        if (stats.totalDaysTracked < 7) {
            return `${stats.completedDays} de ${stats.totalDaysTracked} dias`;
        }
        return `${stats.completedDays} de 7 dias`;
    }

    isNewPatient(): boolean {
        return this.waterStats().totalDaysTracked < 7;
    }
}