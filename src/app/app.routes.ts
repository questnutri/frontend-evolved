import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { authGuard } from './guards/auth-guard';
import { NutritionistPage } from './pages/nutritionist/nutritionist.page';
import { PatientPage } from './pages/patient/patient.page';
import { NutritionistHomePage } from './pages/nutritionist/nutritionist-home/nutritionist-home.page';
import { PatientHomePage } from './pages/patient/patient-home/patient-home.page';
import { App } from './app';
import { PreviewPage } from './pages/preview.page';
import { NutritionistRegisterPage } from './pages/nutritionist/nutritionist-register/nutritionist-register.page';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginPage
    },
    {
        path: 'register',
        component: NutritionistRegisterPage
    },
    {
        path: 'nutritionist',
        component: NutritionistPage,
        canMatch: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: NutritionistHomePage
            }
        ],

    },
    {
        path: 'patient',
        component: PatientPage,
        canMatch: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: PatientHomePage
            }
        ]
    }
];
