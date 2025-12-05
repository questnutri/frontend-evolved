import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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
        const token = this.storageService.get<AuthPayload>('auth')?.accessToken;
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            const fullUrl = `${this.BACKEND_GATEWAY_URL}/notification/me`;
            try {
                const notifications = await firstValueFrom(this.http.get<any[]>(fullUrl, { headers }));
                if (notifications.length > 0) {
                    for (const notificationData of notifications) {
                        if(notificationData.type !== 'ACHIEVEMENT') continue;
                        const notification = notificationData.i18n['pt-BR'];
                        const rarity = notificationData.additionalData?.achievement?.rarity || 'COMMON';

                        this.add({
                            key: 'achievement',
                            data: {
                                title: notification?.title || '',
                                message: notification.message,
                                icon: notificationData.additionalData?.achievement?.icon,
                                rarity: rarity
                            },
                            life: 5000
                        })
                    }
                }
            } catch (error) {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    console.log('Unauthorized - stopping polling');
                    this.stopPolling();
                    return;
                }
                console.log(error);
            }
        }
    }

    async getAll() {
        const token = this.storageService.get<AuthPayload>('auth')?.accessToken;
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            const fullUrl = `${this.BACKEND_GATEWAY_URL}/notification/me/all`;
            try {
                const notifications = await firstValueFrom(this.http.get<any[]>(fullUrl, { headers }));
                return notifications;
            } catch (error) {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    console.log('Unauthorized - stopping polling');
                    this.stopPolling();
                    return [];
                }
                console.log(error);
            }
        }
        return [];
    }

    async ack(notificationId: string): Promise<void> {
        const token = this.storageService.get<AuthPayload>('auth')?.accessToken;
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            const fullUrl = `${this.BACKEND_GATEWAY_URL}/notification/ack`;
            try {
                await firstValueFrom(
                    this.http.post(fullUrl, { ids: [notificationId] }, { headers })
                );
            } catch (error) {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    console.log('Unauthorized - stopping polling');
                    this.stopPolling();
                }
                console.log(error);
            }
        }
    }

    async ackAll(): Promise<void> {
        const token = this.storageService.get<AuthPayload>('auth')?.accessToken;
        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            const fullUrl = `${this.BACKEND_GATEWAY_URL}/notification/ack/all`;
            try {
                await firstValueFrom(
                    this.http.post(fullUrl, {}, { headers })
                );
            } catch (error) {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    console.log('Unauthorized - stopping polling');
                    this.stopPolling();
                }
                console.log(error);
            }
        }
    }

}