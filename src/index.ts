import { handleRequest } from "@service/handler"
import { handleSchedule } from "@service/trigger"
import { onedrive } from "@src/interface/OneDriveAdapter"

globalThis.drive = onedrive

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request))
})

addEventListener('scheduled', (event: ScheduledEvent) => {
  event.waitUntil(handleSchedule(event))
})