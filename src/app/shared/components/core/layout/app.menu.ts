import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@qn/services';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for(item of model(); track $index) {
            @if(item.separator) {
                <li class="menu-separator"></li>
            } @else {
                <li app-menuitem [item]="item" [index]="$index" [root]="true"></li>
            }
        }
    </ul> `
})
export class AppMenu {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    model = signal<MenuItem[]>([]);

    constructor() {
        effect(() => {
            if (this.authService.isAuthenticated()) {
                this.model.set([]);
                this.buildMenu();
            }
        })
    }

    buildMenu() {
        const mainOption = {
            label: '',
            items: [
                {
                    label: 'Patients',
                    icon: 'pi pi-fw pi-users',
                    command: () => {
                        this.router.navigate(['/nutritionist/patients']);
                    }
                },
                {
                    label: 'Profile',
                    icon: 'pi pi-fw pi-user',
                    command: () => {
                        this.router.navigate(['/nutritionist/profile']);
                    }
                },
            ]
        };
        this.addMenuOption(mainOption);
        this.addLogoutOption();
    }

    addMenuOption(config: MenuItem) {
        this.model.update((menu) => {
            menu.push(config);
            return menu;
        });
    }

    addLogoutOption() {
        this.addMenuOption(
            {
                items: [
                    {
                        icon: 'pi pi-fw pi-sign-out',
                        label: 'Logout',
                        command: () => {
                            this.authService.logout();
                            this.router.navigate(['/login']);
                        }
                    }
                ]
            }
        )
    }
}