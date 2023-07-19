import {
  CookieOptions,
  Options,
  SessionData,
  SessionHandler,
  SessionRecord,
  Store
} from './types';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { nanoid } from 'nanoid';
import { MemoryStore } from './memory';
import signature from 'cookie-signature';
import { cookies } from 'next/headers';

export default function nextAppSession<T extends SessionRecord>(
  options: Options
): () => AppSession<T> {
  const store = options.store || new MemoryStore();
  return () => new AppSession<T>(store, cookies(), options);
}

export class AppSession<T extends SessionRecord = SessionRecord>
  implements SessionHandler<T>
{
  static instance: AppSession;
  protected store: Store;
  protected cookies: RequestCookies | ReadonlyRequestCookies;
  protected sid: string;
  protected name: string;
  protected secret?: string;
  protected genid: () => string;
  protected cookieOpts?: Partial<CookieOptions>;
  protected touchAfter?: boolean;

  constructor(
    store: Store,
    cookies: RequestCookies | ReadonlyRequestCookies,
    options: Options
  ) {
    if (AppSession.instance) {
      return AppSession.instance as AppSession<T>;
    }
    AppSession.instance = this;
    this.store = store;
    this.cookies = cookies;
    this.name = options.name || 'sid';
    this.secret = options.secret;
    this.genid = options.genid || nanoid;
    this.cookieOpts = options.cookie;
    this.touchAfter = options.touchAfter;

    this.sid = this._getID();
    return this;
  }

  private _getID(): string {
    let id = this.decode(this.cookies.get(this.name)?.value);
    if (!id && this.genid) {
      id = this.genid();
    }
    return id || '';
  }

  private encode(sid: string): string {
    if (!this.secret || this.secret == '') return sid;
    return sid ? 's:' + signature.sign(sid, this.secret || '') : '';
  }

  private decode(raw: string | null | undefined): string | null {
    if (!raw || !this.secret || this.secret == '') return raw || null;
    return signature.unsign(raw.slice(2), this.secret || '') || null;
  }

  async all(): Promise<SessionData<T> | null | undefined> {
    const data = await this.store?.get(this.sid);
    return data ?? {};
  }
  async get(key: string | keyof T): Promise<any> {
    const data = await this.all();
    return data?.[key] ?? null;
  }
  async has(key: string | keyof T): Promise<boolean> {
    const data = await this.all();
    return !!data?.[key] && data?.[key] !== '';
  }
  async set(key: string | keyof T, value: any): Promise<void> {
    let data: any = await this.all();
    if (!data) {
      data = {};
    }
    data[key] = value;
    await this.setAll(data);
  }
  async setAll(data: T): Promise<void> {
    const guest = this.cookies.get(this.name);
    if (!guest?.value || guest.value == '') {
      await this.cookies.set(this.name, this.encode(this.sid), {
        path: this.cookieOpts?.path || '/',
        httpOnly: this.cookieOpts?.httpOnly ?? true,
        domain: this.cookieOpts?.domain || undefined,
        sameSite: this.cookieOpts?.sameSite,
        secure: this.cookieOpts?.secure || false
      });
    }
    console.log('setAll', data);
    // await this.store.set(this._getID(), { ...data, cookie: this.cookieOpts });
    await this.store.set(this.sid, data);
  }
  async destroy(key?: string | keyof T | undefined): Promise<void> {
    if (key) {
      const data = (await this.all()) || ({} as T);
      delete data[key];
      await this.setAll(data);
    } else {
      await this.setAll({} as T);
    }
  }
}
