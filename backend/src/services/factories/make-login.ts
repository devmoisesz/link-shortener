import { MongooseUsersRepository } from "../../repositories/mongoose/users-mongoose.repository";
import { LoginService } from "../login";

export function makeLogin(){
    const usersRepository = new MongooseUsersRepository()
    const loginService = new LoginService(usersRepository)

    return loginService
}