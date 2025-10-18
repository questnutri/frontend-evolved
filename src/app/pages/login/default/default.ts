import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { QnPasswordInputComponent } from 'src/app/shared/components/qn-password-input/qn-password-input.component';
import { QnNumberInputComponent } from 'src/app/shared/components/qn-number-input/qn-number-input.component';
import { QnButtonComponent } from 'src/app/shared/components/qn-button/qn-button.component';
import { QnTextInputComponent } from 'src/app/shared/components/qn-text-input/qn-text-input.component';
import { navigate } from 'ionicons/icons';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-login-default-page',
    imports: [
        FormsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        QnPasswordInputComponent,
        QnNumberInputComponent,
        QnButtonComponent,
        QnTextInputComponent
    ],
    templateUrl: './default.html',
    styleUrl: './default.scss'
})
export class LoginDefaultPage {
    protected readonly authService = inject(AuthService);
    private readonly router = inject(NavController);
    private readonly notificationService = inject(NotificationService);

    emailInput = signal<string>('');
    passwordInput = signal<string>('');

    constructor() {
        // effect(() => {
        //     if (this.authService.isLogged()) {
        //         this.router.navigate(['/', this.authService.userRole()]);
        //         this.notificationService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome back!' });
        //     }
        // })
    }

    async doLogin() {
        const res = await this.authService.login(this.emailInput(), this.passwordInput());
        if (res.success && res.redirect) {
            console.log(res.redirect)
            this.router.navigateRoot(res.redirect)
        }
    }

}
