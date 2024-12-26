interface CacheItem<T> {
  data: T
  expiry: number
}

export default class CacheService<T> {
  private static instances: Map<string, CacheService<any>> = new Map()
  private cache: Map<string, CacheItem<T>> = new Map()
  private ttl: number

  private constructor(ttlInSeconds: number = 1500) {
    this.ttl = ttlInSeconds * 1000
  }

  public static getInstance<T>(key: string = 'default', ttlInSeconds: number = 1500): CacheService<T> {
    if (!this.instances.has(key)) {
      this.instances.set(key, new CacheService<T>(ttlInSeconds))
    }
    return this.instances.get(key) as CacheService<T>
  }

  set(key: string, value: T): void {
    const expiry = Date.now() + this.ttl
    console.log('Setting cache for key:', key)
    console.log('Expiry time:', expiry)
    this.cache.set(key, {
      data: value,
      expiry: expiry
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) {
      console.log('Cache miss - key not found:', key)
      return null
    }

    if (Date.now() > item.expiry) {
      console.log('Cache expired for key:', key)
      console.log('Current time:', Date.now())
      console.log('Expiry time:', item.expiry)
      this.cache.delete(key)
      return null
    }

    console.log('Cache hit - returning data for key:', key)
    return item.data
  }

  clear(): void {
    this.cache.clear()
  }
}
