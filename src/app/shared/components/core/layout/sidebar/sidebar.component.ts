import { Component, inject, input } from "@angular/core";
import { IonMenu, IonRouterOutlet, IonFooter, IonHeader, IonContent } from "@ionic/angular/standalone";
import { QnButtonComponent, QnDiv } from "@qn/components/basic";
import { DeviceService } from "@qn/services";
import { MenuItem } from "primeng/api";
import { MenuModule } from "primeng/menu";
import { AuthService } from "src/app/services/auth/auth.service";


@Component({
    selector: 'qn-sidebar',
    imports: [
        IonRouterOutlet,
        IonMenu,
        MenuModule,
        QnDiv,
        QnButtonComponent,
        IonFooter,
        IonHeader,
        IonContent
    ],
    template: `
        @if(authService.isLogged()) {
            <ion-menu side="start" menuId="main-menu" contentId="main-content" class="custom-sidebar">
                <ion-header class="ion-no-border">
                    @if(!deviceService.isMobileSize()){
                        <qn-div flex justifyContent="center" alignItems="center" padding="16px" >
                            <img src="/img/qn-fit-inversed.png" alt="QuestNutri Logo" width='100px'/>
                        </qn-div>
                    }
                    @if(deviceService.isMobileSize()) {
                        <qn-div flex-column center padding="16px" color="var(--primary-color)">
                            <div class="user-avatar">
                                <img src="/img/default-avatar.png" alt="User Avatar" />
                            </div>
                            <span class="user-name">LUCAS</span>
                        </qn-div>
                    }
                </ion-header>
                <ion-content class="ion-no-border">
                    <qn-div fill overflow="auto" border='none'>
                        <p-menu [model]="items()" styleClass="sidebar-menu"></p-menu>
                    </qn-div>
                </ion-content>
                <ion-footer class="ion-no-border">
                    <qn-div padding="16px" >
                        <qn-button
                            label="Logout"
                            icon="pi pi-sign-out"
                            (click)="authService.logout()"
                            styleClass="w-full">
                        </qn-button>
                    </qn-div>
                </ion-footer>
            </ion-menu>

            <qn-div id="main-content" fill>
                <ion-router-outlet></ion-router-outlet>
            </qn-div>
        }
    `,

    styles: `
        @use '../../../../../app.scss';

    `
})
export class QnSidebarComponent {
    protected readonly authService = inject(AuthService);
    readonly deviceService = inject(DeviceService);
    items = input.required<MenuItem[]>();

    closeMenu() {
        const menu = document.querySelector('ion-menu');
        if (menu) (menu as any).close();
    }
}