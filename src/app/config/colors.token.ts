import { InjectionToken } from "@angular/core";
import { environment } from '../../environments/environment';


export const BACKEND_GATEWAY_URL = new InjectionToken<{[key: string]: string}>(
    'Token that stores all default colors for directly use',
    {
        providedIn: "root",
        factory: () => {
            return {
                primaryColor: "--primary-color"
            }
        }
    }
);