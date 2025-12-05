import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';

interface WeightRecord {
    id: string;
    valueInKg: string;
    createdAt: string;
    patientId: string;
    registeredBy?: {
        role: string;
        userId: string;
    };
}

@Component({
    selector: 'app-weight-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputNumberModule,
        DatePickerModule,
        ChartModule,
        SelectButtonModule,
        ConfirmDialogModule,
    ],
    templateUrl: './weight.page.html',
    styleUrls: ['./weight.page.scss'],
    providers: [ConfirmationService],
})
export class WeightPage implements OnInit {
    weights = signal<WeightRecord[]>([]);
    showInputPanel = signal(false);
    editingId: string | null = null;
    weightValue: number | null = null;
    selectedDate: Date = new Date();
    today = new Date();
    loading = false;
    selectedTimeRange = '1month';
    activeTab = signal<'history' | 'chart'>('chart');

    timeRangeOptions = [
        { label: '1M', value: '1month' },
        { label: '6M', value: '6months' },
        { label: '1A', value: '1year' },
    ];

    chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.parsed.y} kg`,
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: false,
                ticks: {
                    callback: (value: any) => `${value} kg`,
                },
            },
        },
    };

    constructor(private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.loadWeights();
    }

    loadWeights() {
        this.loading = true;
        setTimeout(() => {
            const mockData = this.generateMockData();
            this.weights.set(mockData);
            this.loading = false;
        }, 500);
    }

    generateMockData(): WeightRecord[] {
        const data: WeightRecord[] = [];
        const today = new Date();

        for (let i = 0; i < 365; i += 3) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            const baseWeight = 72;
            const variation = Math.sin(i / 30) * 2 + (Math.random() - 0.5) * 1;

            data.push({
                id: `weight-${i}`,
                valueInKg: (baseWeight + variation).toFixed(1),
                createdAt: date.toISOString(),
                patientId: 'f44d17e5-e425-41ae-ab15-78289e2e23f3',
            });
        }

        return data.reverse();
    }

    filteredWeights = computed(() => {
        const now = new Date();
        return this.weights().filter((weight) => {
            const weightDate = new Date(weight.createdAt);
            const daysDiff =
                (now.getTime() - weightDate.getTime()) / (1000 * 60 * 60 * 24);

            switch (this.selectedTimeRange) {
                case '1month':
                    return daysDiff <= 30;
                case '6months':
                    return daysDiff <= 180;
                case '1year':
                    return daysDiff <= 365;
                default:
                    return true;
            }
        });
    });

    chartData = computed(() => {
        const filtered = this.filteredWeights();

        const labels = filtered.map((w) => {
            const date = new Date(w.createdAt);
            return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
        });

        const data = filtered.map((w) => parseFloat(w.valueInKg));

        return {
            labels,
            datasets: [
                {
                    label: 'Peso',
                    data,
                    fill: true,
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    pointBackgroundColor: '#8B5CF6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        };
    });

    recentWeights = computed(() => {
        return [...this.weights()]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10);
    });

    latestWeight = computed(() => {
        const sorted = [...this.weights()].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return sorted.length > 0 ? parseFloat(sorted[0].valueInKg) : null;
    });

    weightTrend = computed(() => {
        const sorted = [...this.weights()].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        if (sorted.length < 2) return null;

        const latest = parseFloat(sorted[0].valueInKg);
        const previous = parseFloat(sorted[1].valueInKg);
        const diff = latest - previous;

        return {
            diff: Math.abs(diff).toFixed(1),
            direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
        };
    });

    setActiveTab(tab: 'history' | 'chart') {
        this.activeTab.set(tab);
    }

    toggleInputPanel() {
        if (this.showInputPanel()) {
            this.closeInputPanel();
        } else {
            this.showInputPanel.set(true);
            this.editingId = null;
            this.weightValue = null;
            this.selectedDate = new Date();
        }
    }

    closeInputPanel() {
        this.showInputPanel.set(false);
        this.editingId = null;
        this.weightValue = null;
        this.selectedDate = new Date();
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    formatTime(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    saveWeight() {
        if (!this.weightValue || this.weightValue <= 0) {
            return;
        }

        const newWeight: WeightRecord = {
            id: this.editingId || Date.now().toString(),
            valueInKg: this.weightValue.toFixed(1),
            createdAt: this.selectedDate.toISOString(),
            patientId: 'f44d17e5-e425-41ae-ab15-78289e2e23f3',
            registeredBy: {
                role: 'patient',
                userId: 'f44d17e5-e425-41ae-ab15-78289e2e23f3',
            },
        };

        if (this.editingId) {
            this.weights.update((weights) =>
                weights.map((w) => (w.id === this.editingId ? newWeight : w))
            );
        } else {
            this.weights.update((weights) => [newWeight, ...weights]);
        }

        this.closeInputPanel();
    }

    editWeight(weight: WeightRecord) {
        this.editingId = weight.id;
        this.weightValue = parseFloat(weight.valueInKg);
        this.selectedDate = new Date(weight.createdAt);
        this.showInputPanel.set(true);
    }

    confirmDelete(id: string) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir este registro?',
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            accept: () => {
                this.weights.update((weights) => weights.filter((w) => w.id !== id));
            },
        });
    }
}