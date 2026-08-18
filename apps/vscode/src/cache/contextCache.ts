export class ContextCache {
    private cache = new Map<string, { data: any, expiresAt: number }>();
    private readonly TTL_MS = 60 * 1000; // 1 minute

    get(key: string): any | undefined {
        const entry = this.cache.get(key);
        if (entry && entry.expiresAt > Date.now()) {
            return entry.data;
        }
        if (entry) {
            this.cache.delete(key);
        }
        return undefined;
    }

    set(key: string, data: any) {
        this.cache.set(key, { data, expiresAt: Date.now() + this.TTL_MS });
    }

    invalidate() {
        this.cache.clear();
    }
}
