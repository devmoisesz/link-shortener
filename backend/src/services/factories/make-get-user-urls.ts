import { MongooseShortUrlRepository } from "../../repositories/mongoose/short-url-mongoose.repository";
import { GetUserUrlsService } from "../get-user-urls";

export function makeGetUserUrls(){
    const shortUrlRepository = new MongooseShortUrlRepository()
    const getUserUrlsService = new GetUserUrlsService(shortUrlRepository)

    return getUserUrlsService
}