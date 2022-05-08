import { StoreService, Value } from "@service/StoreService";

export const WorkerStoreService: StoreService = {
    get: function <T>(key: string): Value<T> {
        return STORE.get(key) as any;
    },

    contains: function <T>(key: string): Value<boolean> {
        return STORE.get(key) as any;
    },

    set: function <T>(key: string, value: T): Value<void> {
        return STORE.put(key, value as any);
    },

    put: function <T>(key: string, value: T): Value<void> {
        return STORE.put(key, value as any);
    },

    remove: function <T>(key: string): Value<void> {
        return STORE.delete(key);
    }
}