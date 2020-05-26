import { createServer, IncomingMessage, ServerResponse } from 'http'
import { URL } from 'url'
import fetch from 'node-fetch'
import * as FormData from 'form-data'
import { oauth, ops } from '../config'
import { router } from './router'
import { IncomingWebhook } from '../types'
import { db } from '../index'
import { ObjectId } from 'mongodb'
import { setupSuccess } from '../util/Request'

console.log('Server started.')
createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const { pathname, searchParams } = new URL(req.url, 'http://localhost:3000')
  if (searchParams.get('code')) {
    const accessCode: string | string[] = searchParams.get('code')

    const data: FormData = new FormData()

    data.append('client_id', oauth.CLIENT_ID)
    data.append('client_secret', oauth.CLIENT_SECRET)
    data.append('grant_type', 'authorization_code')
    data.append('redirect_uri', oauth.REDIRECT)
    data.append('scopes', oauth.SCOPES)
    data.append('code', accessCode)

    const { webhook }: IncomingWebhook = await fetch('https://discordapp.com/api/oauth2/token', {
      method: 'POST',
      body: data
    })
      .then((res: any) => res.json())
      .catch((err: Error) => {
        router.checkRoute('/error', req, res)
        console.error(err)
      })

    if (!webhook) {
      router.checkRoute('/error', req, res)
      return
    }

    await db.addWebhook({
      _id: new ObjectId(),
      guild_id: webhook.guild_id,
      channel_id: webhook.channel_id,
      token: webhook.token,
      id: webhook.id
    })

    const initMsg = JSON.stringify({
      embeds: [{
        description: 'Subscribed to [Discord Status Page](https://status.discord.com/) updates!',
        color: 4437377,
        author: {
          name: 'Discord Status',
          icon_url: 'https://discord.com/assets/2c21aeda16de354ba5334551a883b481.png',
          url: ops?.setupUrl ?? 'https://status.discordapp.com'
        },
        footer: {
          text: 'To unsubscribe, delete this webhook in Server Setting > Webhooks > Discord Status Page'
        }
      }]
    })

    await setupSuccess(initMsg, { webhook })
  }

  router.checkRoute(pathname, req, res)
}).listen(3000)
