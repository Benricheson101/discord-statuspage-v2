import Statuspage from './Statuspage'
import Database from './util/Database'
import { checkWebhooks, postUpdate } from './util/Request'
import { generateEmbed } from './util/util'
import { promisify } from 'util'

const Status = new Statuspage({
  url: 'https://status.discordapp.com/index.json',
  file: './build/data.json',
  interval: 30000
})

const db = new Database({
  connectionURI: 'mongodb://localhost/discord_statuspage',
  name: 'discord_statuspage',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
})

Status.on('start', () => {
  console.log('Started')

  db.connect()
    .then(() => {
      setInterval(() => {
        checkWebhooks(db)
      }, 8.64e+7)
      checkWebhooks(db)
    })
})

Status.on('run', console.log)

Status.on('update', async (data) => {
  if (!db.connected) await promisify(setTimeout)(2000)

  const body = await generateEmbed(data)

  postUpdate(body, db)
    .catch(console.error)
})

Status.run()
