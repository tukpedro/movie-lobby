import { ObjectId } from 'mongodb'
import Database from '@ioc:Zakodium/Mongodb/Database'
import Movie from 'App/Models/Movie'
import CacheService from './CacheService'

export default class MovieService {
  private searchCache: CacheService<any[]>

  constructor() {
    this.searchCache = CacheService.getInstance<any[]>('movies', 300)
  }

  private async getCollection() {
    return await Database.connection().collection('movies')
  }

  public async listAll() {
    const collection = await this.getCollection()
    return await collection.find().toArray()
  }

  public async search(query: string) {
    const cacheKey = `search:${query}`
    const cachedResult = this.searchCache.get(cacheKey)

    if (cachedResult) {
      console.log('Cache hit for query:', query);
      console.log('Cached data:', cachedResult);
      return cachedResult;
    }

    console.log('Cache miss for query:', query);
    const collection = await this.getCollection()
    const results = await collection.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } }
      ]
    }).toArray()

    console.log('Setting cache for query:', query);
    console.log('Data being cached:', results);
    this.searchCache.set(cacheKey, results)

    return results
  }

  private clearSearchCache(): void {
    this.searchCache.clear()
  }

  public async create(movieData: Partial<Movie>) {
    const collection = await this.getCollection()
    const movie = new Movie(movieData)
    const result = await collection.insertOne(movie)
    this.clearSearchCache()
    return { ...movie, _id: result.insertedId }
  }

  public async update(id: string, movieData: Partial<Movie>) {
    const collection = await this.getCollection()
    const _id = new ObjectId(id)
    const result = await collection.findOneAndUpdate(
      { _id },
      { $set: { ...movieData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    this.clearSearchCache()
    if (!result) {
      return null
    }
    return { ...result }
  }

  public async delete(id: string) {
    const collection = await this.getCollection()
    const _id = new ObjectId(id)
    const result = await collection.deleteOne({ _id })
    this.clearSearchCache()
    return result
  }
}
