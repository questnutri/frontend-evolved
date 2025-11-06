import { UserRole } from "../enum/user/user-role.enum";

export type AccessTokenResponse = {
    accessToken: string,
    refreshToken: string,
    id: string,
    role: UserRole
}

export type FirstLoginResponse = {
    firstLogin: true,
    resetPassword: string
}

export type SuccessLoginResponse = AccessTokenResponse | FirstLoginResponse

export type ErrorLoginResponse = {
    error: true,
    message: string
}