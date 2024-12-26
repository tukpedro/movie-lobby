import { ObjectId } from 'mongodb'

export default class Movie {
  public _id?: ObjectId
  public title: string
  public genre: string
  public rating: number
  public streamingLink: string
  public createdAt: Date
  public updatedAt: Date

  constructor(data: Partial<Movie>) {
    this.title = data.title!
    this.genre = data.genre!
    this.rating = data.rating!
    this.streamingLink = data.streamingLink!
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }
}
