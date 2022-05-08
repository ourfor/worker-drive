export type Value<T> = Promise<T | null>
export interface StoreService {
    get: <T>(key: string) => Value<T>;
    contains: <T>(key: string) => Value<boolean>;
    set: <T>(key: string, value: T) => Value<void>;
    put: <T>(key: string, value: T) => Value<void>;
    remove: <T>(key: string) => Value<void>;
}