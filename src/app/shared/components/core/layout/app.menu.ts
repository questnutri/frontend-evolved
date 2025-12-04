import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@qn/services';
import { UserRole } from '@qn/enums';

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
        let mainOption = {};
        if (this.authService.userRole() === UserRole.NUTRITIONIST) {
            mainOption = {
                label: '',
                items: [
                    {
                        label: 'Perfil',
                        icon: 'pi pi-fw pi-user',
                        command: () => {
                            this.router.navigate(['/nutritionist/profile']);
                        }
                    },
                    {
                        label: 'Seus pacientes',
                        icon: 'pi pi-fw pi-users',
                        command: () => {
                            this.router.navigate(['/nutritionist/patients']);
                        }
                    },
                ]
            };
        } else {
            mainOption = {
                label: '',
                items: [
                    {
                        label: 'Home',
                        icon: 'pi pi-fw pi-home',
                        command: () => {
                            this.router.navigate(['/patient/home']);
                        }
                    },
                    {
                        label: 'Suas conquistas',
                        icon: 'pi pi-fw pi-trophy',
                        command: () => {
                            this.router.navigate(['/patient/achievements']);
                        }
                    }
                ]
            }
        }

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