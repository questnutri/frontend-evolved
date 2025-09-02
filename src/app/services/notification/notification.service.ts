import { Injectable } from '@angular/core';
import { ToastMessageOptions } from 'primeng/api';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationSubject = new Subject<ToastMessageOptions>();
    notifications$: Observable<ToastMessageOptions> = this.notificationSubject.asObservable();

    add(message: ToastMessageOptions) {
        this.notificationSubject.next(message);
    }

}
