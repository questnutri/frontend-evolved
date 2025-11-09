import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const ResetGuard: CanMatchFn = (route, segments) => {    
    const authService = inject(AuthService);
    if(authService.canReset()) {
        return true;
    }
    const router = inject(Router);

    return router.navigate(['/login']);
}
