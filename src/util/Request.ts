import { DatabaseWebhook, IncomingWebhook } from '../types'
import fetch, { Response } from 'node-fetch'
import Database from './Database'

/**
 * Post an update to all of the webhooks in the list
 * @param {string} body The message to send
 * @param {Database} db The database instance
 * @returns {Promise<{total: number, responses: Map<string, Response>}>}
 */
export async function postUpdate (body: any, db: Database): Promise<{ total: number, responses: Map<string, Response>}> {
  const webhooks = await db.getWebhooks()
  const stats = { total: webhooks.length, responses: new Map<string, Response>() }

  for (const { id, token } of webhooks) {
    const result: void | Response = await fetch(`https://discord.com/api/webhooks/${id}/${token}?wait=1`, {
      method: 'post',
      body,
      headers: {
        'content-type': 'application/json'
      }
    })
      .catch(console.error)

    if (result) stats.responses.set(id, result ?? null)
  }
  return stats
}

/**
 * Check the list of webhooks and remove invalid ones
 * @param {Database} db The database instance
 * @returns {Promise<{existing: number, deleted: number}>}
 */
export async function checkWebhooks (db: Database): Promise<{ existing: number, deleted: number }> {
  const webhooks: DatabaseWebhook[] = await db.getWebhooks()
  const stats = { total: webhooks.length, existing: 0, deleted: 0 }

  for (const { id, token } of webhooks) {
    const result: void | Response = await fetch(`https://discord.com/api/webhooks/${id}/${token}`)
      .catch(console.error)

    if (!result || result?.status === 404 || result?.status === 401) {
      db.deleteWebhook(id, token)
        .catch(console.error)
      stats.deleted++
    } else stats.existing++
  }
  return stats
}

/**
 * Send a message when the webhook is setup
 * @param {string} body The message to send
 * @param {IncomingWebhook} _ The webhook
 * @returns {Promise<Response>}
 */
export async function setupSuccess (body: string, { webhook: { id, token } }: IncomingWebhook): Promise<Response> {
  return await fetch(`https://discord.com/api/webhooks/${id}/${token}`, {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body
  })
}
