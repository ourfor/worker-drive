export type TimeEvent = {
    time: number;
}

export type ScheduledTask = (event: TimeEvent) => Promise<any>

export interface TimeService {
    schedule: (task: ScheduledTask) => void
    start: (task: ScheduledTask) => void
    tasks: () => ScheduledTask[]
}