import { inject, Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthRefreshInterceptor implements HttpInterceptor {
    private authService = inject(AuthService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((err: any) => {
                if (err instanceof HttpErrorResponse && err.status === 401 && this.authService.isAuthenticated()) {
                    return from(this.authService.refresh()).pipe(
                        switchMap((refreshed: boolean) => {
                            if (!refreshed) {
                                this.authService.logout();
                                return throwError(() => err);
                            }

                            const newToken = this.authService.accessToken();
                            const retryReq = newToken
                                ? req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })
                                : req;

                            return next.handle(retryReq);
                        }),
                        catchError(innerErr => {
                            this.authService.logout();
                            return throwError(() => innerErr);
                        })
                    );
                }

                return throwError(() => err);
            })
        );
    }
}