import { handleRequest } from './handler'
import { handleSchedule } from './trigger'

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request))
})

addEventListener('scheduled', (event: ScheduledEvent) => {
  event.waitUntil(handleSchedule(event))
})
