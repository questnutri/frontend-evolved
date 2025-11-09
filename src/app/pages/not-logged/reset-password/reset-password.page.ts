import { Component, computed, inject, input, output, signal } from '@angular/core';
import { NavController } from '@ionic/angular';
import { QnButtonComponent, QnDiv, QnPasswordInputComponent } from "@qn/components/basic";
import { AuthService, NotificationService } from '@qn/services';
import { QnLabelDirective } from "@qn/directives";

@Component({
    selector: 'app-reset-page',
    templateUrl: './reset-password.page.html',
    imports: [QnDiv, QnPasswordInputComponent, QnButtonComponent, QnLabelDirective],
})
export class ResetPage {
    private readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationService);
    private readonly router = inject(NavController);

    newPassword = signal<string>('');
    confirmPassword = signal<string>('');
    previousStep = output<void>();
    token = input<string | null>('');
    firstLogin = input<boolean>(false);

    labelButton = computed(() => {
        return this.firstLogin() ? 'Alterar Senha' : 'Redefinir Senha';
    });

    previous() {
        if (this.firstLogin()) {
            this.router.navigateRoot('/login');
            return;
        }
        this.previousStep.emit();
    }

    async resetPassword() {
        if (!this.newPassword() || !this.confirmPassword()) {
            this.notificationService.add({
                severity: 'error',
                summary: 'As duas senhas devem ser preenchidas!',
                detail: 'Por favor, preencha os dois campos.'
            })
            return;
        }

        if (this.newPassword() !== this.confirmPassword()) {
            this.notificationService.add({
                severity: 'error',
                summary: 'Senhas diferentes!',
                detail: 'Por favor, insira senhas que coincidam.'
            })
            this.newPassword.set('');
            this.confirmPassword.set('');
            return;
        }

        // Validar requisitos da senha
        if (this.newPassword().length < 8) {
            this.notificationService.add({
                severity: 'error',
                summary: 'Senha muito curta!',
                detail: 'A nova senha deve ter pelo menos 8 caracteres.'
            })
            return;
        }

        const res = await this.authService.resetPassword(this.token(), this.newPassword())

        if (res.success) {
            this.notificationService.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha redefinida com sucesso!', life: 3000 })
            this.router.navigateRoot(`/${res.data.role}/home`)
        }
    }
}
