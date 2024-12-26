import { schema, rules } from '@ioc:Adonis/Core/Validator'

export class CreateMovieValidator {
  public schema = schema.create({
    title: schema.string({ trim: true }, [rules.required(), rules.minLength(2)]),
    genre: schema.string({ trim: true }, [rules.required()]),
    rating: schema.number([rules.required(), rules.range(0, 10)]),
    streamingLink: schema.string({ trim: true }, [rules.required(), rules.url()])
  })

  public messages = {
    'title.required': 'Title is required',
    'genre.required': 'Genre is required',
    'rating.required': 'Rating is required',
    'rating.range': 'Rating must be between 0 and 10',
    'streamingLink.required': 'Streaming link is required',
    'streamingLink.url': 'Streaming link must be a valid URL'
  }
}
