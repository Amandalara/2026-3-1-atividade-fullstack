import cors from 'cors'
import express from 'express'

const app = express()
const port = Number(process.env.PORT) || 3333

app.use(cors())
app.use(express.json())

app.get('/', (_request, response) => {
  response.json({
    service: 'diatinf-x-api',
    message: 'API funcionando. Acesse o frontend em http://localhost:5173',
  })
})

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'diatinf-x-api' })
})

app.listen(port, () => {
  console.log(`API do diatinf x disponível em http://localhost:${port}`)
})
