import { UserRole } from "../enum/user/user-role.enum";
import { User } from "../interface/User.interface";

export class UserModel implements User {
    role!: UserRole;

    static from(user: User): UserModel {
        const userModel = new UserModel();
        Object.assign(userModel, user);
        return userModel;
    }

}