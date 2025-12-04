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
    private readonly POLLING_INTERVAL_MS = 30000; // 30 seconds
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


    private queueNotification(id: string, options: ToastMessageOptions) {
        // Skip if already displayed
        if (this.displayedNotificationIds.has(id)) {
            return;
        }

        // Skip if already in queue
        if (this.notificationQueue.some(n => n.id === id)) {
            return;
        }

        this.notificationQueue.push({
            id,
            options,
            timestamp: Date.now()
        });

        this.pendingCount.set(this.notificationQueue.length);
        this.processQueue();
    }


    private async processQueue() {
        if (this.isProcessingQueue || this.notificationQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        while (this.notificationQueue.length > 0) {
            const notification = this.notificationQueue.shift()!;
            this.pendingCount.set(this.notificationQueue.length);

            // Mark as displayed
            this.displayedNotificationIds.add(notification.id);

            // Display the notification
            this.add(notification.options);

            // Wait before showing the next one
            // (notification life + delay between notifications)
            const waitTime = (notification.options.life || this.NOTIFICATION_LIFE_MS) + this.NOTIFICATION_DISPLAY_DELAY_MS;
            await this.delay(waitTime);
        }

        this.isProcessingQueue = false;
    }


    async me() {
        const token = this.storageService.get<AuthPayload>('auth')?.accessToken;
        if (!token) return;

        try {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            const fullUrl = `${this.BACKEND_GATEWAY_URL}/notification/me`;
            const notifications = await firstValueFrom(this.http.get<any[]>(fullUrl, { headers }));

            if (notifications && notifications.length > 0) {
                for (const notification of notifications) {
                    const notificationId = notification.id || notification._id || `${notification.title}-${Date.now()}`;
                    const { title, message, icon } = notification.i18n['pt-BR'];

                    this.queueNotification(notificationId, {
                        key: 'achievement',
                        data: { title, message, icon },
                        life: this.NOTIFICATION_LIFE_MS
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }


    clearDisplayedHistory() {
        this.displayedNotificationIds.clear();
    }


    clearQueue() {
        this.notificationQueue = [];
        this.pendingCount.set(0);
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}