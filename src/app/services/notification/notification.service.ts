import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { options, body } from 'ionicons/icons';
import { ToastMessageOptions } from 'primeng/api';
import { Subject, Observable, firstValueFrom } from 'rxjs';
import { BACKEND_GATEWAY_URL } from 'src/app/config/setup.token';
import { StorageService } from '../storage/storage.service';
import { AuthPayload } from '@qn/types';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly http = inject(HttpClient);
    private readonly storageService = inject(StorageService);
    private readonly BACKEND_GATEWAY_URL = inject(BACKEND_GATEWAY_URL);
    private notificationSubject = new Subject<ToastMessageOptions>();
    notifications$: Observable<ToastMessageOptions> = this.notificationSubject.asObservable();

    add(message: ToastMessageOptions) {
        this.notificationSubject.next(message);
    }

    async me() {
        const headers = new HttpHeaders();
        const token = this.storageService.get<AuthPayload>('auth')?.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
            const fullUrl = `${this.BACKEND_GATEWAY_URL}/notification/me?type=ACHIEVEMENT`;
            const notifications = await firstValueFrom(this.http.get<any[]>(fullUrl, { headers }));
            if (notifications) {
                const notification = notifications[0];
                const { title, message, icon } = notification.i18n['pt-BR'];
                console.log('Notification received:', notification);
                this.add({
                    key: 'achievement',
                    data: { title, message, icon },
                    life: 3000
                })
            }
        }

    }

}