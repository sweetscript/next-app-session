import { SessionData, Store } from './types';
export declare class MemoryStore implements Store {
    store: Map<string, string>;
    _instance?: MemoryStore;
    constructor();
    get(sid: string): Promise<SessionData | null>;
    set(sid: string, sess: SessionData): Promise<void>;
    destroy(sid: string): Promise<void>;
    touch(sid: string, sess: SessionData): Promise<void>;
}
