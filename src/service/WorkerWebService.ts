import { HTTPHandler, WebService } from "@service/WebService";

export const WorkerWebService: WebService = {
    start: function (handler: HTTPHandler): void {
        addEventListener('fetch', (event: FetchEvent) => {
            event.respondWith(handler(event.request))
        })
    }
}
