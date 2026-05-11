import { env } from './config/env'
import { buildApp } from './app'
import { connectMongoDB } from './infrastructure/mongodb'
import { connectRabbitMQ } from './infrastructure/rabbitmq'

async function start(): Promise<void> {
  const app = buildApp()

  await connectMongoDB(app.log)
  await connectRabbitMQ(app.log)

  await app.listen({ port: env.PORT, host: '0.0.0.0' })
}

start().catch((error) => {
  console.error(error)
  process.exit(1)
})
