import { CreateUserRequest } from "./mongoose/users-mongoose.repository"

export interface UsersRepository {
    create(data: CreateUserRequest): Promise<any>
    findByEmail(email: string): Promise<any>
}