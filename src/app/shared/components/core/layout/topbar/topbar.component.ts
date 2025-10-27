import { Component, inject } from "@angular/core";
import { IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { QnDiv } from "@qn/components/basic";
import { AuthService } from "src/app/services/auth/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'qn-topbar',
    imports: [
        IonHeader,
        IonToolbar,
        IonTitle,
        QnDiv
    ],
    template: `
    @if(authService.isLogged()) {
        <ion-header>
            <ion-toolbar [style.--background]="'var(--primary-color)'">
                <qn-div slot="start" (click)="toggleMenu()" paddingLeft="10px" cursor="pointer">
                    <img src="/icons/menu-dark.svg" alt="menu" class="w-6 h-6">
                </qn-div>
                    <ion-title [style.padding]="'10px 0px'">
                        <qn-div flex justifyContent="center" marginRight="10px">
                            <img src="/img/qn-fit-inversed.png" alt="QuestNutri Logo" width="100px"/>
                        </qn-div>
                    </ion-title>
            </ion-toolbar>
        </ion-header>
    }
    `,
    styles: `
    @use '../../../../../../app.scss';
    `
})
export class QnTopbarComponent {
    protected readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    toggleMenu() {
        const menu = document.querySelector('ion-menu');
        if (menu) (menu as any).toggle();
    }
}
