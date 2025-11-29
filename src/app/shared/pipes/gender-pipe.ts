import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'genderTeste'
})
export class GenderPipe implements PipeTransform {

    transform(value: string | undefined | null) {
        if (!value) return 'Não especificado';

        const statusMap: Record<string, string> = {
            'MALE': 'Masculino',
            'FEMALE': 'Feminino',
            'OTHER': 'Outro',
        };
        return statusMap[value] || 'Não especificado';
    }

}
