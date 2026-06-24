import { describe, it, expect, beforeEach } from "vitest";
import { AppError } from "../middleware/AppError";
import { RegisterUserService } from "./register-user";
import { InMemoryUsersRepository } from "../repositories/in-memory/users.in-memory";
import { LoginService } from "./login";
import bcrypt from 'bcrypt'

let usersRepository: InMemoryUsersRepository
let loginService: LoginService
let registerUserService: RegisterUserService

describe('Register Use Case', () => {
    beforeEach(async() => {
        usersRepository = new InMemoryUsersRepository()
        loginService = new LoginService(usersRepository)
        registerUserService = new RegisterUserService(usersRepository)
    })

    it('should be possible to log in with an already registered email address.', async () => {
        const email = "johndoe@example.com"

        await registerUserService.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })

        const result = await loginService.execute({
            email,
            password: '123456'
        })

        expect(result.user.email).toEqual(email)
    })

    it('should not be able to authenticate with wrong email', async () => {
        await expect(() => loginService.execute({
            email: 'johndoe@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError)
    })

    it('It should not be possible to log in with the wrong password.', async () => {

        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            hashedPassword: await bcrypt.hash('123456', 10)
        })

        await expect(() =>
            loginService.execute({
                email: 'johndoe@example.com',
                password: '123457',
            })
        ).rejects.toBeInstanceOf(AppError)
    })
})
