import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WaterService } from '@qn/services';
import { WaterDayResponse } from '@qn/models';

interface WeekDay {
    date: Date;
    dayName: string;
    intake: number;
    goal: number;
    percentage: number;
    isToday: boolean;
}

@Component({
    selector: 'app-water-tracking',
    templateUrl: './water-tracking.page.html',
    styleUrls: ['./water-tracking.page.scss'],
    imports: [CommonModule, FormsModule],
})
export class WaterTrackingPage implements OnInit {
    private readonly waterService = inject(WaterService);

    waterData = signal<WaterDayResponse | null>(null);
    selectedDate = signal<Date>(new Date());
    isLoading = signal(false);
    weekData = signal<WeekDay[]>([]);
    activeTab = signal<'history' | 'week'>('history');
    
    // Custom input
    customAmount = signal<number | null>(null);
    showCustomInput = signal(false);

    // Cached water data map
    private waterByDateMap = new Map<string, { totalIntake: number; currentDailyWaterGoal: string; registers?: any[] }>();

    totalIntake = computed(() => this.waterData()?.totalIntake || 0);
    dailyGoal = computed(() => parseInt(this.waterData()?.currentDailyWaterGoal || '2000'));
    
    progressPercentage = computed(() => {
        const goal = this.dailyGoal();
        const intake = this.totalIntake();
        return goal > 0 ? Math.min(Math.round((intake / goal) * 100), 100) : 0;
    });

    registers = computed(() => {
        const data = this.waterData();
        if (!data?.registers) return [];
        return [...data.registers].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    // Week summary computed values
    weekAverage = computed(() => {
        const data = this.weekData();
        if (data.length === 0) return 0;
        const total = data.reduce((acc, d) => acc + d.intake, 0);
        return total / data.length;
    });

    weekCompletedDays = computed(() => {
        return this.weekData().filter(d => d.percentage >= 100).length;
    });

    weekTotal = computed(() => {
        return this.weekData().reduce((acc, d) => acc + d.intake, 0);
    });

    quickAddAmounts = [200, 250, 500, 1000];

    async ngOnInit() {
        await this.loadAllWaterData();
    }

    /**
     * Load all water data in a SINGLE request and process for different views
     */
    async loadAllWaterData() {
        this.isLoading.set(true);
        try {
            const today = new Date();
            const startDate = new Date(today);
            startDate.setDate(today.getDate() - 29); // Get 30 days of data

            // SINGLE API CALL
            const allWaterData = await this.waterService.getWaterRecordsByRange(
                startDate.toISOString().split('T')[0],
                today.toISOString().split('T')[0]
            );

            // Process the data for different views
            this.processWaterData(allWaterData, today);
        } catch (error) {
            console.error('Failed to load water data:', error);
            this.waterData.set(null);
            this.weekData.set([]);
            this.waterByDateMap.clear();
        } finally {
            this.isLoading.set(false);
        }
    }

    /**
     * Process API response and populate all signals
     */
    private processWaterData(data: any, today: Date) {
        const todayStr = today.toISOString().split('T')[0];
        const selectedStr = this.selectedDate().toISOString().split('T')[0];
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

        // Clear and rebuild the map
        this.waterByDateMap.clear();

        if (Array.isArray(data)) {
            // API returns array of daily summaries
            data.forEach((item: any) => {
                const dateKey = item.relativeDate 
                    ? new Date(item.relativeDate).toISOString().split('T')[0]
                    : item.date;
                this.waterByDateMap.set(dateKey, {
                    totalIntake: item.totalIntake || 0,
                    currentDailyWaterGoal: item.currentDailyWaterGoal || '2000',
                    registers: item.registers || []
                });
            });
        } else if (data?.items && Array.isArray(data.items)) {
            // API returns { items: [...] } with individual records, aggregate by date
            const aggregated = new Map<string, { total: number; goal: string; registers: any[] }>();
            
            (data.items as any[]).forEach((record: any) => {
                const dateKey = record.relativeDate 
                    ? new Date(record.relativeDate).toISOString().split('T')[0]
                    : new Date(record.createdAt).toISOString().split('T')[0];
                
                let existing = aggregated.get(dateKey);
                if (!existing) {
                    existing = { 
                        total: 0, 
                        goal: record.currentDailyWaterGoal || '2000',
                        registers: [] as any[]
                    };
                    aggregated.set(dateKey, existing);
                }
                
                const amount = parseFloat(record.amountInMl) || 0;
                
                // Handle ADD/SUBTRACT operations
                if (record.operation === 'SUB' || record.operation === 'SUBTRACT' || record.operation === 'subtract') {
                    existing.total -= amount;
                } else {
                    existing.total += amount;
                }
                existing.total = Math.max(0, existing.total);
                existing.registers.push(record);
            });

            aggregated.forEach((value, key) => {
                this.waterByDateMap.set(key, {
                    totalIntake: value.total,
                    currentDailyWaterGoal: value.goal,
                    registers: value.registers
                });
            });
        } else if (data?.totalIntake !== undefined) {
            // Single day response
            this.waterByDateMap.set(todayStr, {
                totalIntake: data.totalIntake || 0,
                currentDailyWaterGoal: data.currentDailyWaterGoal || '2000',
                registers: data.registers || []
            });
        }

        // Set selected date's data (today by default)
        this.updateSelectedDateData(selectedStr);

        // Build week data
        const weekDays: WeekDay[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const isToday = dateStr === todayStr;
            
            const dayData = this.waterByDateMap.get(dateStr);
            const intake = dayData?.totalIntake || 0;
            const goal = parseInt(dayData?.currentDailyWaterGoal || '2000');
            const percentage = goal > 0 ? Math.min(Math.round((intake / goal) * 100), 100) : 0;

            weekDays.push({
                date,
                dayName: isToday ? 'Hoje' : dayNames[i],
                intake,
                goal,
                percentage,
                isToday
            });
        }
        this.weekData.set(weekDays);
    }

    /**
     * Update selected date's water data from cached map (NO API CALL)
     */
    private updateSelectedDateData(dateStr: string) {
        const dayData = this.waterByDateMap.get(dateStr);
        if (dayData) {
            this.waterData.set({
                totalIntake: dayData.totalIntake,
                currentDailyWaterGoal: dayData.currentDailyWaterGoal,
                registers: dayData.registers || []
            } as WaterDayResponse);
        } else {
            this.waterData.set({
                totalIntake: 0,
                currentDailyWaterGoal: '2000',
                registers: []
            } as WaterDayResponse);
        }
    }

    /**
     * Change selected date - uses cached data, NO API CALL
     */
    changeDate(days: number) {
        const newDate = new Date(this.selectedDate());
        newDate.setDate(newDate.getDate() + days);
        this.selectedDate.set(newDate);
        
        const dateStr = newDate.toISOString().split('T')[0];
        this.updateSelectedDateData(dateStr);
    }

    /**
     * Select a specific day from the week view - uses cached data, NO API CALL
     */
    selectDay(day: WeekDay) {
        this.selectedDate.set(day.date);
        const dateStr = day.date.toISOString().split('T')[0];
        this.updateSelectedDateData(dateStr);
        this.activeTab.set('history');
    }

    getWeekDayColor(day: WeekDay): string {
        if (day.percentage >= 100) return '#22C55E';
        if (day.percentage >= 75) return '#3B82F6';
        if (day.percentage >= 50) return '#EAB308';
        return '#EF4444';
    }

    getProgressRingStyle(percentage: number): string {
        const color = this.getWeekDayColor({ percentage } as WeekDay);
        const angle = Math.min(percentage, 100) * 3.6;
        return `conic-gradient(${color} ${angle}deg, #e5e7eb ${angle}deg)`;
    }

    setActiveTab(tab: 'history' | 'week') {
        this.activeTab.set(tab);
    }

    toggleCustomInput() {
        this.showCustomInput.update(v => !v);
        if (!this.showCustomInput()) {
            this.customAmount.set(null);
        }
    }

    async addCustomWater() {
        const amount = this.customAmount();
        if (amount && amount > 0) {
            await this.addWater(amount);
            this.customAmount.set(null);
            this.showCustomInput.set(false);
        }
    }

    async addWater(amountInMl: number) {
        try {
            await this.waterService.registerWater({
                amountInMl: amountInMl.toString(),
                operation: 'ADD'
            });
            // Reload all data after adding
            await this.loadAllWaterData();
        } catch (error) {
            console.error('Error adding water:', error);
        }
    }

    async removeWater(amountInMl: number) {
        try {
            await this.waterService.registerWater({
                amountInMl: amountInMl.toString(),
                operation: 'SUB'
            });
            // Reload all data after removing
            await this.loadAllWaterData();
        } catch (error) {
            console.error('Error removing water:', error);
        }
    }

    formatTime(registerHour: string): string {
        if (!registerHour) return '--:--';
        return registerHour.slice(0, 5);
    }

    formatWaterMl(value: number): string {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}L`;
        }
        return `${value}ml`;
    }

    isToday(): boolean {
        const today = new Date();
        const selected = this.selectedDate();
        return today.toDateString() === selected.toDateString();
    }

    formatDate(): string {
        const date = this.selectedDate();
        const today = new Date();

        if (date.toDateString() === today.toDateString()) {
            return 'Hoje';
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Ontem';
        }

        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
        });
    }

    parseInt = parseInt;
}