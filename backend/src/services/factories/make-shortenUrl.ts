import { MongooseShortUrlRepository } from "../../repositories/mongoose/short-url-mongoose.repository";
import { MongooseUsersRepository } from "../../repositories/mongoose/users-mongoose.repository";
import { LoginService } from "../login";
import { ShortenUrlService } from "../shortenUrl";

export function makeShortenUrl(){
    const shortUrlRepository = new MongooseShortUrlRepository()
    const shortenUrl = new ShortenUrlService(shortUrlRepository)

    return shortenUrl
}