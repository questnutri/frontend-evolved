import { UserRole } from "../enum/user/user-role.enum";

export type AuthPayload = {
    accessToken: string,
    refreshToken: string,
    id: string,
    role: UserRole
}

export type FirstLoginResponse = {
    firstLogin: true,
    resetPassword: string
}

export type SuccessLoginResponse = AuthPayload | FirstLoginResponse

export type ErrorLoginResponse = {
    error: true,
    message: string
}