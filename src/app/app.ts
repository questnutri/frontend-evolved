import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { mail } from "ionicons/icons";
import { AppHealthComponent } from './shared/components/app-health/app-health.component';
import { MessageService } from 'primeng/api';
import { RealLandingComponent } from "./real-landing/real-landing";


@Component({
    selector: 'app-root',
    templateUrl: 'app.html',
    styleUrl: 'app.scss',
    imports: [IonicModule, RealLandingComponent],
    providers: [MessageService]
})
export class App {}