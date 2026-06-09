import 'dotenv/config'
import { createApp } from './app'
import { env } from './config/env'

const app = createApp()

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}`)
  console.log(`📄 Environment: ${env.NODE_ENV}`)
})