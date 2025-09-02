import { UserRole } from "../enum/user/user-role.enum";

export type SuccessLoginResponse = {
    accessToken: string,
    refreshToken: string,
    role: UserRole
} | {
    firstLogin: true,
    resetToken: string
}

export type ErrorLoginResponse = {
    error: true,
    message: string
}