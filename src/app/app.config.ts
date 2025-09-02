import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicRouteStrategy } from '@ionic/angular';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideHttpClient(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
    ]
};
