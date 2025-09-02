import { Component, signal, OnInit, inject } from '@angular/core';
import { HealthService, HealthStatus } from '../../../services/health/health.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'qn-app-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-health.component.html',
  styleUrls: ['./app-health.component.scss']
})
export class AppHealthComponent implements OnInit {
  private readonly healthService = inject(HealthService);

  statuses = signal<HealthStatus[]>([]);
  loading = signal<boolean>(true);

  async ngOnInit() {
    this.loading.set(true);
    const res = await this.healthService.getHealth();
    this.statuses.set(res);
    this.loading.set(false);
  }
}
