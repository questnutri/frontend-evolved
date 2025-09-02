import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BACKEND_GATEWAY_URL } from "../../config/setup.token";
import { firstValueFrom } from "rxjs";

export interface HealthStatus {
    name: string;
    healthy: boolean;
    info?: any;
}

@Injectable({ providedIn: 'root' })
export class HealthService {
    private readonly http = inject(HttpClient);
    private readonly BACKEND_GATEWAY_URL = inject(BACKEND_GATEWAY_URL);

    async getHealth(): Promise<HealthStatus[]> {
        try {
            const res = await firstValueFrom(this.http.get<any>(`${this.BACKEND_GATEWAY_URL}/health`));
            // Expecting a shape like { services: [{ name, healthy, info }] } or map
            if (Array.isArray(res)) {
                return res.map((s: any) => ({ name: s.name || 'service', healthy: !!s.healthy, info: s.info }));
            }
            if (res?.services && Array.isArray(res.services)) {
                return res.services.map((s: any) => ({ name: s.name || 'service', healthy: !!s.healthy, info: s.info }));
            }
            // Support the explicit services-status map shape
            if (res?.['services-status'] && typeof res['services-status'] === 'object') {
                return Object.keys(res['services-status']).map(key => ({ name: key, healthy: !!res['services-status'][key], info: undefined }));
            }
            // If it's a map where keys are service names and values contain "healthy"
            return Object.keys(res || {}).map(key => ({ name: key, healthy: !!res[key]?.healthy, info: res[key] }));
        } catch (e) {
            // if we can't reach the health endpoint, return a single unhealthy service
            return [{ name: 'gateway', healthy: false, info: e }];
        }
    }
}
