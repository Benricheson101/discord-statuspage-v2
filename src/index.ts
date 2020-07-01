import Statuspage from './Statuspage'
import Database from './util/Database'
import { checkWebhooks, postUpdate } from './util/Request'
import { generateEmbed } from './util/util'
import { promisify } from 'util'
import { database, ops } from './config'

let mode: number = 3
if (
  process.env.BACKEND && !process.env.FRONTEND
) mode = 2
else if (
  process.env.FRONTEND && !process.env.BACKEND
) mode = 1

if (mode === 3 || mode === 1) import('./web/server')

const status = new Statuspage({
  url: ops.statuspage,
  file: './build/data.json',
  interval: 30000
})

export const db = new Database({
  connectionURI: database,
  name: 'discord_statuspage',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
})

db.connect()
  .then(() => {
    if (mode === 3 || mode === 2) return
    setInterval(() => {
      checkWebhooks(db)
    }, 8.64e+7)
    checkWebhooks(db)
  })
  .catch(console.error)

status.on('start', () => console.log('Started'))

status.on('update', async (data) => {
  if (!db.connected) await promisify(setTimeout)(2000)

  const body = await generateEmbed(data)

  postUpdate(body, db)
    .catch(console.error)
})

if (mode === 3 || mode === 2) status.run()
