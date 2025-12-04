import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';
import { Subject, Observable, firstValueFrom, interval, Subscription } from 'rxjs';
import { BACKEND_GATEWAY_URL } from 'src/app/config/setup.token';
import { StorageService } from '../storage/storage.service';
import { AuthPayload } from '@qn/types';

interface QueuedNotification {
    id: string;
    options: ToastMessageOptions;
    timestamp: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService implements OnDestroy {
    private readonly http = inject(HttpClient);
    private readonly storageService = inject(StorageService);
    private readonly BACKEND_GATEWAY_URL = inject(BACKEND_GATEWAY_URL);

    private notificationSubject = new Subject<ToastMessageOptions>();
    notifications$: Observable<ToastMessageOptions> = this.notificationSubject.asObservable();

    // Queue management
    private notificationQueue: QueuedNotification[] = [];
    private isProcessingQueue = false;
    private displayedNotificationIds = new Set<string>();

    // Polling management
    private pollingSubscription: Subscription | null = null;
    private readonly POLLING_INTERVAL_MS = 10000; // 10 seconds
    private readonly NOTIFICATION_DISPLAY_DELAY_MS = 1500; // Delay between notifications
    private readonly NOTIFICATION_LIFE_MS = 4000; // How long each notification stays

    // Signals for reactive state
    readonly isPolling = signal(false);
    readonly pendingCount = signal(0);

    ngOnDestroy() {
        this.stopPolling();
    }


    startPolling() {
        if (this.pollingSubscription) return;

        this.isPolling.set(true);

        // Fetch immediately
        this.me();

        // Then poll at intervals
        this.pollingSubscription = interval(this.POLLING_INTERVAL_MS).subscribe(() => {
            this.me();
        });
    }


    stopPolling() {
        this.pollingSubscription?.unsubscribe();
        this.pollingSubscription = null;
        this.isPolling.set(false);
    }


    add(message: ToastMessageOptions) {
        this.notificationSubject.next(message);
    }

    async me() {
        const headers = new HttpHeaders();
        const token = this.storageService.get<AuthPayload>('auth')?.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
            const fullUrl = `${this.BACKEND_GATEWAY_URL}/notification/me`;
            const notifications = await firstValueFrom(this.http.get<any[]>(fullUrl, { headers }));
            if (notifications.length > 0) {
                const notification = notifications[0].i18n['pt-BR'];
                console.log('Notification received:', notification);
                this.add({
                    key: 'achievement',
                    data: { title: notification?.title || '', message: notification.message, icon: notification.icon },
                    life: 3000
                })
            }
        }

    }

}