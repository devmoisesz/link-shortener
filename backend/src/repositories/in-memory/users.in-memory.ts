import { randomUUID } from "node:crypto";
import { UsersRepository } from "../users.repository"

interface User {
    name: string,
    email: string,
    password: string
}

export class InMemoryUsersRepository implements UsersRepository{
    public items: User[] = []


    async create({name, email, password}: User){
        const user = {
            id: randomUUID(),
            name,
            email, 
            password,
            created_at: new Date()
        }

        this.items.push(user)

        return user
    }

    async findByEmail(email: string) {
        const user = this.items.find((item) => item.email === email)

        return user
    }
}