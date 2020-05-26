import './web/server'
import Statuspage from './Statuspage'
import Database from './util/Database'
import { checkWebhooks, postUpdate } from './util/Request'
import { generateEmbed } from './util/util'
import { promisify } from 'util'
import { database, ops } from './config'

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

status.on('start', () => {
  console.log('Started')

  db.connect()
    .then(() => {
      setInterval(() => {
        checkWebhooks(db)
      }, 8.64e+7)
      checkWebhooks(db)
    })
})

status.on('update', async (data) => {
  if (!db.connected) await promisify(setTimeout)(2000)

  const body = await generateEmbed(data)

  postUpdate(body, db)
    .catch(console.error)
})

status.run()
