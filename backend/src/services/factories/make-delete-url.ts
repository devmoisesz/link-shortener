import { MongooseShortUrlRepository } from "../../repositories/mongoose/short-url-mongoose.repository";
import { DeleteUrlService } from "../delete-url"

export function makeDeleteUrl(){
    const shortUrlRepository = new MongooseShortUrlRepository()
    const deleteUrlService = new DeleteUrlService(shortUrlRepository)

    return deleteUrlService
}