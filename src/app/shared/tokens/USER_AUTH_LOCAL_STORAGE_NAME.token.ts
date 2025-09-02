import { InjectionToken } from "@angular/core";

export const USER_AUTH_LOCAL_STORAGE_NAME = new InjectionToken<string>(
    'Token that describes the name of storage on localstorage of user auth',
    {
        providedIn: "root",
        factory: () => 'userAuth'
    }
);