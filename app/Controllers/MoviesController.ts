import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MovieService from 'App/Services/MovieService'
import { CreateMovieValidator } from 'App/Validators/MovieValidator'

export default class MoviesController {
  private movieService = new MovieService()

  public async index({ response }: HttpContextContract) {
    try {
      const movies = await this.movieService.listAll()
      return response.json(movies)
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Failed to fetch movies',
        error: error.message
      })
    }
  }

  public async search({ request, response }: HttpContextContract) {
    try {
      const query = request.input('q')
      if (!query) {
        return response.status(400).json({
          status: 'error',
          message: 'Search query is required'
        })
      }

      const movies = await this.movieService.search(query)
      return response.json(movies)
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Failed to search movies',
        error: error.message
      })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateMovieValidator)
      const movie = await this.movieService.create(payload)
      return response.status(201).json(movie)
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Failed to create movie',
        error: error.messages || error.message
      })
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateMovieValidator)
      const movie = await this.movieService.update(params.id, payload)

      if (!movie) {
        return response.status(404).json({
          status: 'error',
          message: 'Movie not found'
        })
      }

      return response.json(movie)
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Failed to update movie',
        error: error.messages || error.message
      })
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const result = await this.movieService.delete(params.id)

      if (result.deletedCount === 0) {
        return response.status(404).json({
          status: 'error',
          message: 'Movie not found'
        })
      }

      return response.status(204)
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Failed to delete movie',
        error: error.message
      })
    }
  }
}
