import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeviceService } from '../../../services/device/device.service';
import { QnDiv, QnTextInputComponent, QnPasswordInputComponent, QnButtonComponent, QnNumberInputComponent, QnDropDownComponent, QnMaskInputComponent } from '@qn/components/basic';
import { QnLabelDirective } from "@qn/directives";
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';

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
        QnDiv,
        QnTextInputComponent,
        QnLabelDirective,
        QnPasswordInputComponent,
        QnButtonComponent,
        QnNumberInputComponent,
        QnDropDownComponent,
        QnMaskInputComponent
    ]
})
export class NutritionistRegisterPage {

    private readonly deviceService = inject(DeviceService);

    // Controle do stepper
    activeStep: number = 1;

    // Dados do Step 1 - Configuração da Conta
    name = signal<string>('');
    email = signal<string>('');
    password = signal<string>('');

    // Dados do Step 2 - Detalhes Pessoais e Profissionais
    crn = signal<string | undefined>(undefined);
    phone = signal<string | undefined>(undefined);
    selectedDocument = signal<string>('cpf');
    documentNumber = signal<string | undefined>(undefined);

    // Opções para o dropdown de documento
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

    finishRegistration(): void {
        const registrationData = {
            name: this.name(),
            email: this.email(),
            password: this.password(),
            crn: this.crn(),
            phone: this.phone(),
            documentType: this.selectedDocument(),
            documentNumber: this.documentNumber()
        };
        console.log('✅ Cadastro válido! Dados prontos para envio:', registrationData);
    }
}