import { InjectionToken } from "@angular/core";

export const AUTH_LOCAL_STORAGE_NAMES = new InjectionToken<{
    accessToken: string,
    refreshToken: string,
    userRole: string,
    userId: string
}>(
    'Token that describes the names of local storages for AUTH',
    {
        providedIn: "root",
        factory: () => ({
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            userRole: 'userRole',
            userId: 'userId'
        })
    }
);