export type CookieOptions = {
    httpOnly: boolean;
    path: string;
    domain?: string | undefined;
    secure: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    maxAge?: number;
    expires?: Date | null;
};
export type SessionRecord = Record<string, any>;
export type SessionData<T = SessionRecord> = T & {
    cookie: CookieOptions;
};
export interface Store<T = any> {
    get(sid: string): Promise<SessionData<T> | null | undefined>;
    set(sid: string, sess: SessionData<any>): Promise<void>;
    destroy(sid: string): Promise<void>;
    touch?(sid: string, sess: SessionData<any>): Promise<void>;
}
export type Options = {
    /**
     * Name of the client cookie that holds the session ID
     * @default 'sid'
     */
    name?: string;
    /**
     * This is the secret used to sign the session cookie which will hold the user session ID.
     * If left empty the session ID is not signed/encoded
     */
    secret?: string;
    /**
     * This callback can be used to override the session id creation allowing you to set your own,
     * By default nanoid package is used to generate new session IDs
     */
    genid?: () => string;
    /**
     * The session store instance, defaults to a new `MemoryStore` instance.
     * @see MemoryStore
     */
    store?: Store;
    /**
     * @default true
     */
    touchAfter?: boolean;
    cookie?: Partial<Pick<CookieOptions, 'maxAge' | 'httpOnly' | 'path' | 'domain' | 'secure' | 'sameSite'>>;
};
export interface SessionHandler<T extends SessionRecord = SessionRecord> {
    get(key: keyof T | string): Promise<unknown | null | undefined>;
    all(): Promise<SessionData<T> | null | undefined>;
    has(key: keyof T | string): Promise<boolean>;
    set(key: keyof T | string, value: unknown): Promise<void>;
    setAll(data: T): Promise<void>;
    destroy(key?: keyof T | string): Promise<void>;
}
