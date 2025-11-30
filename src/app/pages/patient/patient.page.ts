import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-patient',
    imports: [
        RouterOutlet
    ],
    template: `<router-outlet/>`,
})
export class PatientPage {}