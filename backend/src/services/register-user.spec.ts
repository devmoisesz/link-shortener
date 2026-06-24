import { describe, it, expect, beforeEach } from "vitest";
import { AppError } from "../middleware/AppError";
import { RegisterUserService } from "./register-user";
import { InMemoryUsersRepository } from "../repositories/in-memory/users.in-memory";
import bcrypt from 'bcrypt'

let usersRepository: InMemoryUsersRepository
let registerUserService: RegisterUserService

describe('Register Use Case', () => {
    beforeEach(async() => {
        usersRepository = new InMemoryUsersRepository()
        registerUserService = new RegisterUserService(usersRepository)
    })
    it('It should be possible to register.', async () => {

        const user = await registerUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('Check if the password was encrypted correctly.', async () => {
    
        const user = await registerUserService.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })

        const isPasswordCorrectlyHashed = await bcrypt.compare(
            '123456',
            user.hashedPassword
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {

        const email = 'johedoe@example.com'

        await registerUserService.execute({
            name: 'John Doe',
            email,
            password: '123456',
        })

        await expect(() =>
            registerUserService.execute({
                name: 'John Doe',
                email,
                password: '123456',
            })
        ).rejects.toBeInstanceOf(AppError)
    })
})
