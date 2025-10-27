import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mail, paperPlane, heart, archive, trash, warning } from "ionicons/icons";
import { MessageService } from 'primeng/api';
import { AuthService } from './services/auth/auth.service';

import { QnGlobalToastComponent, QnLayoutComponent } from '@qn/components/core';


@Component({
    selector: 'app-root',
    templateUrl: 'app.html',
    styleUrl: 'app.scss',
    imports: [
    IonicModule,
    RouterLink,
    QnGlobalToastComponent,
    RouterOutlet,
    QnLayoutComponent
],
    providers: [MessageService]
})
export class App {
    private readonly authService = inject(AuthService);
    public appPages = [
        { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
        { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
        { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
        { title: 'Archived', url: '/folder/archived', icon: 'archive' },
        { title: 'Trash', url: '/folder/trash', icon: 'trash' },
        { title: 'Spam', url: '/folder/spam', icon: 'warning' },
    ];
    public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
    constructor() {
        addIcons({ mail })
        // addIcons({mail, paperPlane, heart, archive, trash, warning});
    }

    doLogout() {
        this.authService.logout();
    }
}
