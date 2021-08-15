import { handleRequest } from "@service/handler"
import { handleSchedule } from "@service/trigger"

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request))
})

addEventListener('scheduled', (event: ScheduledEvent) => {
  event.waitUntil(handleSchedule(event))
})