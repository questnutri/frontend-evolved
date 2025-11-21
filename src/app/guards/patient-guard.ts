import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@qn/services';
import { UserRole } from '@qn/enums';

export const PatientGuard: CanMatchFn = (route, segments) => {
    const authService = inject(AuthService);

    if (authService.userRole() === UserRole.PATIENT) {
        return true;
    }
    const router = inject(Router);
    return router.navigate([authService.userRole(), 'home']);
}