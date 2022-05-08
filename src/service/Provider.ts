import { WorkerStoreService } from "@service/WorkerStoreService"
import { WorkerTimeService } from "@service/WorkerTimeService";
import { WorkerWebService } from "@service/WorkerWebService";

export enum BeanType {
    STORE,
    HTTP,
    TIME,
    HTTP_SERVER
}

export function Provider<T>(type: BeanType): T | null {
    let instance: any = null;
    switch (type) {
        case BeanType.STORE: {
            instance = WorkerStoreService
            break
        }
        case BeanType.TIME: {
            instance = WorkerTimeService
            break
        }
        case BeanType.HTTP_SERVER: {
            instance = WorkerWebService
            break
        }
        default: {
        }
    }
    return instance as T
}