import { DatabaseWebhook } from '../types'
import fetch, { Response } from 'node-fetch'
import Database from './Database'

export async function postUpdate (body: any, db: Database): Promise<{ total: number, responses: Map<string, Response>}> {
  const webhooks = await db.getWebhooks()
  const stats = { total: webhooks.length, responses: new Map() }

  for (const { id, token } of webhooks) {
    const result: void | Response = await fetch(`https://discord.com/api/webhooks/${id}/${token}?wait=1`, {
      method: 'post',
      body,
      headers: {
        'content-type': 'application/json'
      }
    })
      .catch(console.error)

    if (result) {
      if (result?.status !== 200) console.log(id, result.status)
      stats.responses.set(id, result ?? null)
    }
  }
  return stats
}

export async function checkWebhooks (db: Database): Promise<{ existing: number, deleted: number }> {
  const webhooks: DatabaseWebhook[] = await db.getWebhooks()
  const stats = { total: webhooks.length, existing: 0, deleted: 0 }

  for (const { id, token } of webhooks) {
    const result: void | Response = await fetch(`https://discord.com/api/webhooks/${id}/${token}`)
      .catch(console.error)

    if (!result) return stats

    if (result?.status === 404 || result?.status === 401) {
      db.deleteWebhook(id, token)
        .then(console.log)
        .catch(console.error)
      stats.deleted++
    } else stats.existing++
  }
  return stats
}
