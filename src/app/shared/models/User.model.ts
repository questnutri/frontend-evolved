import { UserRole } from "../enum/user/user-role.enum";

export interface User {
    role: UserRole
    id: string;
}

export class UserModel implements User {
    role!: UserRole;
    id!: string;

    static from(user: User): UserModel {
        const userModel = new UserModel();
        Object.assign(userModel, user);
        return userModel;
    }

}