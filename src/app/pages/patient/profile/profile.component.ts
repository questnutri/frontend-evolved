import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { QnMaskInputComponent, QnPasswordInputComponent, QnTextInputComponent, QnButtonComponent, QnDropDownComponent } from "@qn/components/basic";
import { QnLabelDirective } from "@qn/directives";
import { PatientModel } from '@qn/models';
import { AuthService, NotificationService, PatientService } from '@qn/services';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { Address } from 'src/app/shared/interface/address.interface';

@Component({
    selector: 'app-patient-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    imports: [QnTextInputComponent, QnLabelDirective, QnMaskInputComponent, QnPasswordInputComponent, QnButtonComponent, QnDropDownComponent, DatePickerModule, FluidModule],
})
export class PatientProfilePage implements OnInit {
    private readonly patientService = inject(PatientService);
    private readonly notificationService = inject(NotificationService);
    protected readonly authService = inject(AuthService);

    patient = signal<PatientModel | null>(null);
    
    // Password fields as individual signals
    currentPassword = signal<string>('');
    newPassword = signal<string>('');
    confirmNewPassword = signal<string>('');
    
    personalInformation = signal<boolean>(true);
    personalAddress = signal<boolean>(true);
    changePassword = signal<boolean>(true);
    selectedAddressId = signal<string | undefined>(undefined);
    addressSelected = signal<Address | null>(null);

    optionsGender = [
        { label: 'Masculino', value: 'MALE' },
        { label: 'Feminino', value: 'FEMALE' },
        { label: 'Outro', value: 'OTHER' },
    ];

    constructor() {
    }

    async ngOnInit() {
        this.patient.set(
            await this.patientService.getMe()
        );
    }

    phoneNumberFormatted() {
        const phone = this.patient()?.phone || '';
        return phone.replace(/\D/g, '');
    }

    handleSave() { /* toast success */ }

    passwordChange() {
        if (this.newPassword() !== this.confirmNewPassword()) {
            this.notificationService.add({ severity: 'error', summary: 'Erro ao alterar senha', detail: 'As senhas não coincidem.' });
            return;
        }
        if (this.currentPassword().trim() === '') {
            this.notificationService.add({ severity: 'error', summary: 'Erro ao alterar senha', detail: 'A senha atual não pode estar vazia.' });
            return;
        }
        if (this.newPassword().trim() === '') {
            this.notificationService.add({ severity: 'error', summary: 'Erro ao alterar senha', detail: 'A nova senha não pode estar vazia.' });
            return;
        }
        if (this.confirmNewPassword().trim() === '') {
            this.notificationService.add({ severity: 'error', summary: 'Erro ao alterar senha', detail: 'A confirmação da nova senha não pode estar vazia.' });
            return;
        }

        this.authService.changePassword(
            this.currentPassword(),
            this.newPassword()
        );
        
        // Clear fields after successful change
        this.currentPassword.set('');
        this.newPassword.set('');
        this.confirmNewPassword.set('');
    }

    onLogout() { }

    handleChangePersonalInformationMode() {
        this.personalInformation.set(!this.personalInformation());
    }

    handleChangePersonalAddressMode() {
        this.personalAddress.set(!this.personalAddress());
    }

    handleChangePasswordMode() {
        this.changePassword.set(!this.changePassword());
        
        // Clear password fields when closing the edit mode
        if (this.changePassword()) {
            this.currentPassword.set('');
            this.newPassword.set('');
            this.confirmNewPassword.set('');
        }
    }

    handleChangeAddressSelected(addressId: string | undefined) {
        this.selectedAddressId.set(addressId);
    }
}