import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { QnDiv } from "@qn/components/basic";
import { AuthService } from "src/app/services/auth/auth.service";
import { Avatar } from 'primeng/avatar';
import { DeviceService } from "@qn/services";
import { PopoverModule } from "primeng/popover";

@Component({
    selector: 'qn-topbar',
    imports: [
        IonHeader,
        IonToolbar,
        IonTitle,
        QnDiv,
        Avatar,
        PopoverModule
    ],
    template: `
    @if(authService.isLogged()) {
        <ion-header>
            <ion-toolbar [style.--background]="'var(--primary-color)'">
                <qn-div slot="start" (click)="toggleMenu()" paddingLeft="20px" cursor="pointer">
                    <img src="/icons/menu-dark.svg" alt="menu" class="w-6 h-6">
                </qn-div>
                    <ion-title [style.padding]="'10px 0px'">
                        <qn-div flex justifyContent="center">
                            <img src="/img/qn-fit-inversed.png" alt="QuestNutri Logo" width="100px"/>
                        </qn-div>
                    </ion-title>
                    <qn-div slot="end" paddingRight="20px" cursor="pointer">
                       @if(!deviceService.isMobileSize()){
                            <p-avatar shape="circle" [style]="{'border': '1px solid white', 'padding': '2px'}" size="large" (click)="op.toggle($event)"/>
                            <p-popover #op>
                                <qn-div flex-column padding='10px' gap='10px' alignItems='start'>
                                    <span>Perfil</span>
                                    <span (click)="authService.logout()" [style]="{'border': '1px solid white', 'padding': '2px'}">Logout</span>
                                </qn-div>
                            </p-popover>
                        }
                    </qn-div>
            </ion-toolbar>
        </ion-header>
    }
    `,
    styles: `
        @use '../../../../../app.scss';
    `
})
export class QnTopbarComponent {
    protected readonly authService = inject(AuthService);
    readonly deviceService = inject(DeviceService);
    private readonly router = inject(Router);

    toggleMenu() {
        const menu = document.querySelector('ion-menu');
        if (menu) (menu as any).toggle();
    }
}
