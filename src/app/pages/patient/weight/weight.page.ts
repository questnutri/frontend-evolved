import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { WeightService } from 'src/app/services/weight/weight.service';
import { WeightRecord } from 'src/app/shared/interface/weight.interface';

@Component({
    selector: 'app-weight-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputNumberModule,
        ChartModule,
        SelectButtonModule,
        ConfirmDialogModule,
    ],
    templateUrl: './weight.page.html',
    styleUrls: ['./weight.page.scss'],
    providers: [ConfirmationService],
})
export class WeightPage implements OnInit {
    private readonly weightService = inject(WeightService);
    private readonly confirmationService = inject(ConfirmationService);

    weights = signal<WeightRecord[]>([]);
    showInputPanel = signal(false);
    editingId: string | null = null;
    weightValue: number | null = null;
    loading = signal(false);
    saving = signal(false);
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

    ngOnInit() {
        this.loadWeights();
    }

    async loadWeights() {
        this.loading.set(true);
        try {
            const response = await this.weightService.getAll();
            this.weights.set(response.items);
        } catch (error) {
            console.error('Failed to load weights:', error);
        } finally {
            this.loading.set(false);
        }
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
        const filtered = [...this.filteredWeights()].sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

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
                    borderColor: '#F97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    tension: 0.4,
                    pointBackgroundColor: '#F97316',
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
        }
    }

    closeInputPanel() {
        this.showInputPanel.set(false);
        this.editingId = null;
        this.weightValue = null;
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

    async saveWeight() {
        if (!this.weightValue || this.weightValue <= 0) {
            return;
        }

        this.saving.set(true);
        try {
            const newWeight = await this.weightService.createOne(this.weightValue);
            this.weights.update((weights) => [newWeight, ...weights]);
            this.closeInputPanel();
        } catch (error) {
            console.error('Failed to save weight:', error);
        } finally {
            this.saving.set(false);
        }
    }

    editWeight(weight: WeightRecord) {
        this.editingId = weight.id;
        this.weightValue = parseFloat(weight.valueInKg);
        this.showInputPanel.set(true);
    }

    confirmDelete(id: string) {
        // this.confirmationService.confirm({
        //     message: 'Tem certeza que deseja excluir este registro?',
        //     header: 'Confirmar Exclusão',
        //     icon: 'pi pi-exclamation-triangle',
        //     acceptLabel: 'Sim',
        //     rejectLabel: 'Não',
        //     accept: () => {
        //         // TODO: Implement delete API call when available
        //         this.weights.update((weights) => weights.filter((w) => w.id !== id));
        //     },
        // });
    }
}