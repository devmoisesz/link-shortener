import { MongooseShortUrlRepository } from "../../repositories/mongoose/short-url-mongoose.repository";
import { RedirectLinkService } from "../redirect-link";

export function makeRedirectLink(){
    const shortUrlRepository = new MongooseShortUrlRepository()
    const redirectlinkService = new RedirectLinkService(shortUrlRepository)

    return redirectlinkService
}