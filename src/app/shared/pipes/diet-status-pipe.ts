import { Pipe, PipeTransform } from '@angular/core';

interface StatusMap {
    value: string;
    color: string;
}

@Pipe({
    name: 'dietStatus'
})
export class DietStatusPipe implements PipeTransform {

    transform(value: string | undefined | null): StatusMap {
        if (!value) return { value: 'Definição', color: '' };

        const statusMap: Record<string, string> = {
            'DEFINITION': 'Definição',
            'ACTIVE': 'Ativo',
        };

        const colorMap: Record<string, string> = {
            'DEFINITION': '#23a3ff',
            'ACTIVE': '#28a746',
        }

        return { value: statusMap[value] || 'Definição', color: colorMap[value] || '' };
    }

}
