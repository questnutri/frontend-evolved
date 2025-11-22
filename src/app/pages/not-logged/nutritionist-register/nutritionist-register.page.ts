import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QnButtonComponent, QnDropDownComponent, QnMaskInputComponent, QnPasswordInputComponent, QnTextInputComponent } from '@qn/components/basic';
import { QnLabelDirective } from "@qn/directives";
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { DeviceService } from '../../../services/device/device.service';
import { NotificationService, NutritionistService } from '@qn/services';
import { NavController } from '@ionic/angular';

interface DocumentOption {
    label: string;
    value: string;
}

@Component({
    selector: 'nutritionist-register',
    templateUrl: './nutritionist-register.page.html',
    styleUrls: ['./nutritionist-register.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        StepperModule,
        ButtonModule,
        QnTextInputComponent,
        QnLabelDirective,
        QnPasswordInputComponent,
        QnButtonComponent,
        QnDropDownComponent,
        QnMaskInputComponent
    ]
})
export class NutritionistRegisterPage {

    private readonly deviceService = inject(DeviceService);
    private readonly notificationService = inject(NotificationService);
    private readonly nutritionistService = inject(NutritionistService);
    private readonly router = inject(NavController);

    activeStep = signal<number>(1);

    name = signal<string>('');
    email = signal<string>('');
    password = signal<string>('');

    crn = signal<string | undefined>(undefined);
    phone = signal<string | undefined>(undefined);
    selectedDocument = signal<string>('cpf');
    documentNumber = signal<string | undefined>(undefined);

    optionsDocument: DocumentOption[] = [
        {
            label: "CPF",
            value: 'cpf'
        },
        {
            label: "CNPJ",
            value: 'cnpj'
        }
    ];

    documentMask = computed(() => {
        return this.selectedDocument() === 'cpf' ? '999.999.999-99' : '99.999.999/9999-99';
    })

    onDocumentChange(event: DocumentOption): void {
        this.selectedDocument.set(event.value);
        this.documentNumber.set(undefined); // Limpa o número do documento ao trocar o tipo
    }

    goToStep2(activateCallback: (step: number) => void): void {
        activateCallback(2);
    }

    goToStep1(activateCallback: (step: number) => void): void {
        activateCallback(1);
    }

    async finishRegistration(): Promise<void> {
        const registrationData = {
            name: this.name(),
            email: this.email(),
            password: this.password(),
            crn: this.crn(),
            phone: this.phone(),
            documentType: this.selectedDocument(),
            documentNumber: this.documentNumber()
        };

        const fieldNames: Record<string, string> = {
            name: 'Nome',
            email: 'E-mail',
            password: 'Senha',
            crn: 'CRN',
            phone: 'Telefone',
            documentType: 'Tipo de Documento',
            documentNumber: 'Número do Documento'
        };

        const emptyFields = Object.entries(registrationData)
            .filter(([_, value]) => !value || value.toString().trim() === '')
            .map(([key]) => fieldNames[key] || key);

        if (emptyFields.length > 0) {
            const fieldsList = emptyFields.join(', ');
            this.notificationService.add({
                severity: 'warn',
                summary: 'Campos obrigatórios',
                detail: `Preencha os seguintes campos: ${fieldsList}.`
            });
            if (emptyFields.includes('E-mail') || emptyFields.includes('Nome') || emptyFields.includes('Senha')) {
                this.activeStep.set(1);
            }
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registrationData.email)) {
            this.notificationService.add({
                severity: 'error',
                summary: 'E-mail inválido',
                detail: 'Por favor, insira um e-mail válido.'
            });
            this.activeStep.set(1);
            return;
        }

        const res = await this.nutritionistService.registerNutritionist(registrationData);
        if (res.success && res.redirect) {
            this.notificationService.add({ severity: 'success', summary: 'Conta de nutricionista criada com sucesso!', detail: 'Aguarde aprovação da conta!' });
            this.router.navigateRoot(res.redirect);
        }
    }


}