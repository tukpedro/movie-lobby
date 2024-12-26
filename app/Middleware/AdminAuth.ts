import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminAuth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const adminKey = request.header('admin-key')

    if (adminKey !== process.env.ADMIN_KEY) {
      return response.status(401).json({
        status: 'error',
        message: 'Unauthorized - Admin access required'
      })
    }

    await next()
  }
}
