import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

type StorageLike = {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
};

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private subjects = new Map<string, BehaviorSubject<any>>();
    private storage: StorageLike;

    readonly session: StorageService;
    readonly cookie: StorageService;

    constructor() {
        this.storage = this.localStorageAdapter();

        this.session = this.createScopedStorage(this.sessionStorageAdapter());
        this.cookie = this.createScopedStorage(this.cookieStorageAdapter());
    }

    get<T = any>(key: string): T | null {
        const item = this.storage.getItem(key);
        return item ? JSON.parse(item) as T : null;
    }

    add(values: { [key: string]: any }): void {
        for (const [key, value] of Object.entries(values)) {
            this.storage.setItem(key, JSON.stringify(value));
            this.emitChange(key, value);
        }
    }

    remove(keyOrKeys: string | string[]): void {
        const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
        for (const key of keys) {
            this.storage.removeItem(key);
            this.emitChange(key, null);
        }
    }

    clear(): void {
        this.storage.clear();
        for (const key of this.subjects.keys()) this.emitChange(key, null);
    }

    watch<T = any>(key: string): Observable<T | null> {
        if (!this.subjects.has(key)) {
            const initial = this.get<T>(key);
            this.subjects.set(key, new BehaviorSubject<T | null>(initial));
        }
        return this.subjects.get(key)!.asObservable();
    }

    private createScopedStorage(storage: StorageLike): StorageService {
        const clone = Object.create(this);
        clone.storage = storage;
        clone.subjects = this.subjects;
        return clone;
    }

    private emitChange<T = any>(key: string, value: T | null): void {
        if (!this.subjects.has(key)) {
            this.subjects.set(key, new BehaviorSubject<T | null>(value));
        } else {
            this.subjects.get(key)!.next(value);
        }
    }

    private localStorageAdapter(): StorageLike {
        return {
            getItem: key => localStorage.getItem(key),
            setItem: (key, value) => localStorage.setItem(key, value),
            removeItem: key => localStorage.removeItem(key),
            clear: () => localStorage.clear()
        };
    }

    private sessionStorageAdapter(): StorageLike {
        return {
            getItem: key => sessionStorage.getItem(key),
            setItem: (key, value) => sessionStorage.setItem(key, value),
            removeItem: key => sessionStorage.removeItem(key),
            clear: () => sessionStorage.clear()
        };
    }

    private cookieStorageAdapter(): StorageLike {
        return {
            getItem: key => {
                const match = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
                return match ? decodeURIComponent(match[2]) : null;
            },

            setItem: (key, value) => {
                document.cookie = `${key}=${encodeURIComponent(value)}; path=/`;
            },

            removeItem: key => {
                document.cookie = `${key}=; Max-Age=0; path=/`;
            },

            clear: () => {
                document.cookie.split(";").forEach(cookie => {
                    const key = cookie.split("=")[0].trim();
                    document.cookie = `${key}=; Max-Age=0; path=/`;
                });
            }
        };
    }
}
