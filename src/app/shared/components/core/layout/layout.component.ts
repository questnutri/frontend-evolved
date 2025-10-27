import { Component } from "@angular/core";
import { QnTopbarComponent } from "./topbar/topbar.component";
import { QnSidebarComponent } from "./sidebar/sidebar.component";
import { RouterModule } from "@angular/router";
import { QnGlobalToastComponent } from "../global-toast/global-toast.component";

@Component({
    selector: 'qn-layout',
    template: `
        <qn-global-toast></qn-global-toast>
        <qn-sidebar [items]="items"></qn-sidebar>
        <qn-topbar></qn-topbar>
        <router-outlet></router-outlet>
    `,
    imports: [QnTopbarComponent, QnSidebarComponent, RouterModule, QnGlobalToastComponent]
})
export class QnLayoutComponent {
    items = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            routerLink: ['/dashboard']
        },
        {
            label: 'Pacientes',
            icon: 'pi pi-users',
            items: [
                { label: 'Lista de Pacientes', icon: 'pi pi-list', routerLink: ['/patients'] },
                { label: 'Novo Paciente', icon: 'pi pi-user-plus', routerLink: ['/patients/new'] }
            ]
        },
        {
            label: 'Dietas',
            icon: 'pi pi-apple',
            items: [
                { label: 'Minhas Dietas', icon: 'pi pi-book', routerLink: ['/diets'] },
                { label: 'Criar Dieta', icon: 'pi pi-plus-circle', routerLink: ['/diets/create'] }
            ]
        },
        {
            label: 'Relatórios',
            icon: 'pi pi-chart-line',
            routerLink: ['/reports']
        },
        {
            label: 'Configurações',
            icon: 'pi pi-cog',
            routerLink: ['/settings']
        }
    ];

}