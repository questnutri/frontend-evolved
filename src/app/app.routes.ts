import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { NutritionistPage } from './pages/nutritionist/nutritionist.page';
import { NutritionistHomePage } from './pages/nutritionist/nutritionist-home/nutritionist-home.page';
import { ForgotPasswordPage } from './pages/not-logged/forgot-password/forgot-password.page';
import { AppLayout } from '@qn/components/core';
import { ResetPage } from './pages/not-logged/reset-password/reset-password.page';
import { ResetGuard } from './guards/reset-guard';
import { NotLoggedLayout } from './pages/not-logged/not-logged.page';
import { LoginPage } from './pages/not-logged/login/login.page';
import { NutritionistRegisterPage } from './pages/nutritionist/nutritionist-register/nutritionist-register.page';
import { RealLandingComponent } from './pages/real-landing/real-landing';
import { NutritionistGuard } from './guards/nutritionist-guard';
import { NutritionistProfilePage } from './pages/nutritionist/nutritionist-profile/nutritionist-profile.component';
import { PatientPage } from './pages/patient/patient.page';
import { PatientHomePage } from './pages/patient/patient-home/patient-home.page';
import { PatientGuard } from './guards/patient-guard';
import { NutritionistPatientsPage } from './pages/nutritionist/nutritionist-patients/nutritionist-patients.page';
import { NutritionistPatientDetailsPage } from './pages/nutritionist/nutritionist-patient-details/nutritionist-patient-details.page';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: 'nutritionist',
                component: NutritionistPage,
                canMatch: [AuthGuard, NutritionistGuard],
                children: [
                    {
                        path: '',
                        redirectTo: 'home',
                        pathMatch: 'full'
                    },
                    {
                        path: 'home',
                        component: NutritionistHomePage
                    },
                    {
                        path: 'profile',
                        component: NutritionistProfilePage
                    },
                    {
                        path: 'patients',
                        component: NutritionistPatientsPage
                    },
                    {
                        path: 'patient/:patientId',
                        component: NutritionistPatientDetailsPage,
                    }
                ],
            },
            {
                path: 'patient',
                component: PatientPage,
                canMatch: [AuthGuard, PatientGuard],
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
                    ,
                    // {
                    //     path: 'profile',
                    //     component: NutritionistProfilePage
                    // }
                ],
            },
        ],
        canActivate: [AuthGuard]
    },
    {
        path: '',
        component: NotLoggedLayout,
        children: [
            {
                path: 'login',
                component: LoginPage,
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordPage
            },
            {
                path: 'reset-password',
                component: ResetPage,
                canActivate: [ResetGuard]
            }
        ]
    },
    {
        path: 'landing',
        component: RealLandingComponent,
    },
    {
        path: 'register',
        component: NutritionistRegisterPage
    },
    // {
    //     path: 'nutritionist',
    //     component: NutritionistPage,
    //     canMatch: [authGuard],
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: 'home',
    //             pathMatch: 'full'
    //         },
    //         {
    //             path: 'home',
    //             component: NutritionistHomePage
    //         }
    //     ],

    // },
    // {
    //     path: 'patient',
    //     component: PatientPage,
    //     canMatch: [authGuard],
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: 'home',
    //             pathMatch: 'full'
    //         },
    //         {
    //             path: 'home',
    //             component: PatientHomePage
    //         }
    //     ]
    // }
];
