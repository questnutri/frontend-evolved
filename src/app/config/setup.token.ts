import { InjectionToken } from "@angular/core";
import { environment } from '../../environments/environment';


export const BACKEND_GATEWAY_URL = new InjectionToken<string>(
    'Token that stores the backend API gateway URL',
    {
        providedIn: "root",
        factory: () => `${environment.backendApiUrl}/api/v1`
    }
);