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

    totalIntake = computed(() => this.waterData()?.totalIntake || 0);
    dailyGoal = computed(() => parseInt(this.waterData()?.currentDailyWaterGoal || '2000'));
    progressPercentage = computed(() => {
        const goal = this.dailyGoal();
        const intake = this.totalIntake();
        return goal > 0 ? Math.min(Math.round((intake / goal) * 100), 100) : 0;
    });

    registers = computed(() => {
        const regs = this.waterData()?.registers || [];
        return [...regs].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    });

    // Week summary computed values
    weekAverage = computed(() => {
        const data = this.weekData();
        if (data.length === 0) return 0;
        return data.reduce((acc, d) => acc + d.intake, 0) / 7 / 1000;
    });

    weekCompletedDays = computed(() => {
        return this.weekData().filter(d => d.percentage >= 100).length;
    });

    weekTotal = computed(() => {
        return this.weekData().reduce((acc, d) => acc + d.intake, 0) / 1000;
    });

    quickAddAmounts = [200, 250, 500, 1000];

    async ngOnInit() {
        await this.loadWaterData();
        await this.loadWeekData();
    }

    async loadWaterData() {
        this.isLoading.set(true);
        try {
            const data = await this.waterService.getWaterRecordsByDate(
                this.selectedDate().toISOString().split('T')[0]
            );
            this.waterData.set(data);
        } catch (error) {
            console.error('Error loading water data:', error);
        } finally {
            this.isLoading.set(false);
        }
    }

    async loadWeekData() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

        const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
        const weekDays: WeekDay[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const isToday = date.toDateString() === today.toDateString();

            try {
                const data = await this.waterService.getWaterRecordsByDate(
                    date.toISOString().split('T')[0]
                );
                const intake = data?.totalIntake || 0;
                const goal = parseInt(data?.currentDailyWaterGoal || '2000');
                const percentage = goal > 0 ? Math.min(Math.round((intake / goal) * 100), 100) : 0;

                weekDays.push({
                    date,
                    dayName: isToday ? 'Hoje' : dayNames[i],
                    intake,
                    goal,
                    percentage,
                    isToday
                });
            } catch {
                weekDays.push({
                    date,
                    dayName: isToday ? 'Hoje' : dayNames[i],
                    intake: 0,
                    goal: 2000,
                    percentage: 0,
                    isToday
                });
            }
        }

        this.weekData.set(weekDays);
    }

    getWeekDayColor(day: WeekDay): string {
        if (day.percentage >= 100) {
            return '#22C55E';
        } else if (day.percentage >= 75) {
            return '#EAB308';
        } else if (day.percentage >= 50) {
            return '#F97316';
        } else {
            return '#EF4444';
        }
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
            await this.loadWaterData();
            await this.loadWeekData();
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
            await this.loadWaterData();
            await this.loadWeekData();
        } catch (error) {
            console.error('Error removing water:', error);
        }
    }

    formatTime(registerHour: string): string {
        return registerHour.slice(0, 5);
    }

    changeDate(days: number) {
        const newDate = new Date(this.selectedDate());
        newDate.setDate(newDate.getDate() + days);
        this.selectedDate.set(newDate);
        this.loadWaterData();
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