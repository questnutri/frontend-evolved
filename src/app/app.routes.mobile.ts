import { Routes } from "@angular/router";
import { AppLayout } from "@qn/components/core";
import { AuthGuard } from "./guards/auth-guard";
import { NutritionistGuard } from "./guards/nutritionist-guard";
import { PatientGuard } from "./guards/patient-guard";
import { ResetGuard } from "./guards/reset-guard";
import { ForgotPasswordPage } from "./pages/not-logged/forgot-password/forgot-password.page";
import { LoginPage } from "./pages/not-logged/login/login.page";
import { NotLoggedLayout } from "./pages/not-logged/not-logged.page";
import { NutritionistRegisterPage } from "./pages/not-logged/nutritionist-register/nutritionist-register.page";
import { ResetPage } from "./pages/not-logged/reset-password/reset-password.page";
import { PatientDietDetailsPage } from "./pages/nutritionist/diet-details/diet-details.page";
import { NutritionistHomePage } from "./pages/nutritionist/home/home.page";
import { NutritionistPatientDetailsPage } from "./pages/nutritionist/patient-details/patient-details.page";
import { NutritionistPatientDietsSection } from "./pages/nutritionist/patient-details/sections/diets/diets.section";
import { NutritionistPatientHealthSection } from "./pages/nutritionist/patient-details/sections/health/health.section";
import { NutritionistPatientInfoSection } from "./pages/nutritionist/patient-details/sections/info/info.section";
import { NutritionistPatientRecordsSection } from "./pages/nutritionist/patient-details/sections/records/records.section";
import { NutritionistPatientsPage } from "./pages/nutritionist/patients-list/patients-list.page";
import { NutritionistProfilePage } from "./pages/nutritionist/profile/profile.component";
import { AchievementsPage } from "./pages/patient/achievements/achievements.page";
import { PatientHomePage } from "./pages/patient/patient-home/patient-home.page";
import { WaterTrackingPage } from "./pages/patient/water/water-tracking.page";
import { WeightPage } from "./pages/patient/weight/weight.page";
import { RealLandingComponent } from "./pages/real-landing/real-landing";


export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'nutritionist',
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
                        children: [
                            {
                                path: '',
                                component: NutritionistPatientDetailsPage,
                                children: [
                                    {
                                        path: '',
                                        redirectTo: 'info',
                                        pathMatch: 'full'
                                    },
                                    {
                                        path: 'info',
                                        component: NutritionistPatientInfoSection
                                    },
                                    {
                                        path: 'diets',
                                        component: NutritionistPatientDietsSection
                                    },
                                    {
                                        path: 'health',
                                        component: NutritionistPatientHealthSection
                                    },
                                    {
                                        path: 'records',
                                        component: NutritionistPatientRecordsSection
                                    }
                                ]
                            },
                            {
                                path: 'diet/:dietId',
                                component: PatientDietDetailsPage
                            }
                        ]
                    }
                ],
            },
            {
                path: 'patient',
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
                    },
                    {
                        path: 'achievements',
                        component: AchievementsPage
                    },
                    {
                        path: 'water',
                        component: WaterTrackingPage
                    },
                    {
                        path: 'weight',
                        component: WeightPage
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
        path: 'register',
        component: NutritionistRegisterPage
    },
];
