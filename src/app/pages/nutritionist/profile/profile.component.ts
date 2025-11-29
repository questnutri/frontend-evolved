import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { QnMaskInputComponent, QnPasswordInputComponent, QnTextInputComponent, QnButtonComponent, QnDropDownComponent } from "@qn/components/basic";
import { QnLabelDirective } from "@qn/directives";
import { NutritionistModel } from '@qn/models';
import { AuthService, NotificationService, NutritionistService } from '@qn/services';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { Address } from 'src/app/shared/interface/address.interface';

interface NewPassword {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

@Component({
    selector: 'app-nutritionist-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    imports: [QnTextInputComponent, QnLabelDirective, QnMaskInputComponent, QnPasswordInputComponent, QnButtonComponent, QnDropDownComponent, DatePickerModule, FluidModule],
})
export class NutritionistProfilePage implements OnInit {
    private readonly nutritionistService = inject(NutritionistService);
    private readonly notificationService = inject(NotificationService);
    protected readonly authService = inject(AuthService);

    nutritionist = signal<NutritionistModel | null>(null);
    password = signal<NewPassword>({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    personalInformation = signal<boolean>(true);
    personalAddress = signal<boolean>(true);
    changePassword = signal<boolean>(true);
    selectedAddressId = signal<string | undefined>(undefined);
    addressSelected = signal<Address | null>(null);

    optionsDocType = [
        { label: 'CPF', value: 'cpf' },
        { label: 'CNPJ', value: 'cnpj' },
    ];

    optionsGender = [
        { label: 'Masculino', value: 'male' },
        { label: 'Feminino', value: 'female' },
        { label: 'Outro', value: 'other' },
    ];

    constructor() {

        effect(() => {
            const addressId = this.selectedAddressId();
            const selectedAddress = this.nutritionist()?.addresses?.find(
                address => address.id === addressId
            ) ?? null;

            this.addressSelected.set(selectedAddress);
        });
    }
    async ngOnInit() {
        this.nutritionist.set(
            await this.nutritionistService.getMe(true, false)
        );

        if (this.nutritionist()?.mainAddress) {
            this.selectedAddressId.set(this.nutritionist()?.mainAddress?.id);
        }
    }

    phoneNumberFormatted() {
        const phone = this.nutritionist()?.phone || '';
        return phone.replace(/\D/g, '');
    }

    handleSave() { /* toast success */ }

    passwordChange() {
        if (this.password().newPassword !== this.password().confirmNewPassword) {
            this.notificationService.add({ severity: 'error', summary: 'Erro ao alterar senha', detail: 'As senhas não coincidem.' });
        }
        if (this.password().currentPassword.trim() === '') {
            this.notificationService.add({ severity: 'error', summary: 'Erro ao alterar senha', detail: 'A senha atual não pode estar vazia.' });
        }
        if (this.password().newPassword.trim() === '') {
            this.notificationService.add({ severity: 'error', summary: 'Erro ao alterar senha', detail: 'A nova senha não pode estar vazia.' });
        }
        if (this.password().confirmNewPassword.trim() === '') {
            this.notificationService.add({ severity: 'error', summary: 'Erro ao alterar senha', detail: 'A confirmação da nova senha não pode estar vazia.' });
        }

        const res = this.authService.changePassword(
            this.password().currentPassword,
            this.password().newPassword
        );
    }
    onLogout() { /* logout */ }

    handleChangePersonalInformationMode() {
        this.personalInformation.set(!this.personalInformation());
    }

    handleChangePersonalAddressMode() {
        this.personalAddress.set(!this.personalAddress());
    }

    handleChangePasswordMode() {
        this.changePassword.set(!this.changePassword());
    }


    handleChangeAddressSelected(addressId: string | undefined) {
        this.selectedAddressId.set(addressId);
    }


    //TODO: MUDAR COR DA TABELA
}