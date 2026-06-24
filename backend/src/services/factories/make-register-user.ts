import { MongooseUsersRepository } from "../../repositories/mongoose/users-mongoose.repository";
import { RegisterUserService } from "../register-user";

export function makeRegisterUser(){
    const usersRepository = new MongooseUsersRepository()
    const registerUserService = new RegisterUserService(usersRepository)

    return registerUserService
}