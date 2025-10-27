import { Component, inject, input } from "@angular/core";
import { IonRouterOutlet } from "@ionic/angular/standalone";
import { IonMenu } from "@ionic/angular/standalone";
import { MenuItem } from "primeng/api";
import { MenuModule } from "primeng/menu";
import { AuthService } from "src/app/services/auth/auth.service";



@Component({
    selector: 'qn-sidebar',
    imports: [
        IonRouterOutlet,
        IonMenu,
        MenuModule
    ],
    template: `
        @if(authService.isLogged()) {    
            <ion-menu side="start" menuId="main-menu" contentId="main-content">
                <div class="flex flex-col h-full bg-surface-100 dark:bg-surface-900 text-surface-700 dark:text-surface-0">
                    <div class="p-4 flex items-center justify-between border-b border-surface-200 dark:border-surface-700">
                        <h2 class="text-lg font-semibold">QuestNutri</h2>
                        <button pButton icon="pi pi-times" class="p-button-text" (click)="closeMenu()"></button>
                    </div>
                    <div class="flex-1 overflow-y-auto">
                        <p-menu [model]="items()" styleClass="border-none shadow-none bg-transparent"></p-menu>
                    </div>
                    <div class="p-4 border-t border-surface-200 dark:border-surface-700">
                        <button pButton label="Logout" icon="pi pi-sign-out" class="w-full p-button-danger" (click)="logout()"></button>
                    </div>
                </div>
            </ion-menu>
        
            <div id="main-content" class="h-full">
                <ion-router-outlet></ion-router-outlet>
            </div>
        }
    `,
    styles: `
        @use '../../../../../app.scss';
    `
})
export class QnSidebarComponent {
    protected readonly authService = inject(AuthService);
    items = input.required<MenuItem[]>();

    closeMenu() {
        const menu = document.querySelector('ion-menu');
        if (menu) (menu as any).close();
    }

    logout() {
        console.log('Logout');
    }
}
