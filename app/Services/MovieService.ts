import { ObjectId } from 'mongodb'
import Database from '@ioc:Zakodium/Mongodb/Database'
import Movie from 'App/Models/Movie'

export default class MovieService {
  private async getCollection() {
    return await Database.connection().collection('movies')
  }

  public async listAll() {
    const collection = await this.getCollection()
    return await collection.find().toArray()
  }

  public async search(query: string) {
    const collection = await this.getCollection()
    return await collection.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } }
      ]
    }).toArray()
  }

  public async create(movieData: Partial<Movie>) {
    const collection = await this.getCollection()
    const movie = new Movie(movieData)
    const result = await collection.insertOne(movie)
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
    if (!result) {
      return null
    }
    return { ...result }
  }

  public async delete(id: string) {
    const collection = await this.getCollection()
    const _id = new ObjectId(id)
    return await collection.deleteOne({ _id })
  }
}
