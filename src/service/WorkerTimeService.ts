import { CONST_URL } from '@src/const'
import { TokenData } from '@model/TokenData'
import { Cors } from '@config/Cors'
import { i18n, I18N_KEY } from '@lang/i18n'
import { BeanType, Provider } from '@service/Provider'
import { StoreService } from '@service/StoreService'
import { ScheduledTask, TimeEvent, TimeService } from './TimeService'

const tasks: ScheduledTask[] = [];

export const WorkerTimeService: TimeService = {
  start: function (task: ScheduledTask) {
    addEventListener('scheduled', (event: ScheduledEvent) => {
      const args: TimeEvent = {
        time: event.scheduledTime
      }

      const doTask: () => Promise<void> = () => {
        return task(args)
      }

      event.waitUntil(doTask())
    })
  },

  schedule: function (task: ScheduledTask): void {
    tasks.push(task)
  },

  tasks: function (): ScheduledTask[] {
    return tasks;
  }
}