import { CookieOptions, Options, SessionData, SessionHandler, SessionRecord, Store } from './types';
export default function nextAppSession<T extends SessionRecord>(options: Options): () => AppSession<T>;
export declare class AppSession<T extends SessionRecord = SessionRecord> implements SessionHandler<T> {
    static instance: AppSession;
    protected store: Store;
    protected sid: string;
    protected name: string;
    protected secret?: string;
    protected genid: () => string;
    protected cookieOpts?: Partial<CookieOptions>;
    protected touchAfter?: boolean;
    constructor(store: Store, options: Options);
    private getCookies;
    private _getID;
    private _initID;
    private encode;
    private decode;
    all(): Promise<SessionData<T> | null | undefined>;
    get(key: string | keyof T): Promise<any>;
    has(key: string | keyof T): Promise<boolean>;
    set(key: string | keyof T, value: any): Promise<void>;
    setAll(data: T): Promise<void>;
    destroy(key?: string | keyof T | undefined): Promise<void>;
}
