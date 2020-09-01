import { ops } from '../config'
import { StatuspageJSON } from '../types'
import moment = require('moment')

/**
 * Generate an embed with statuspage info
 * @param {StatuspageJSON} data - The statuspage data
 * @returns {Promise<string>}
 */
export function generateEmbed (data: StatuspageJSON): string {
  const currentIncident = data.incidents[0]

  // const author: { username: string, discriminator: number, avatar: string } = await fetch(`https://discordapp.com/api/users/${ops.devId}`, {
  //   headers: {
  //     authorization: `Bot ${ops.token}`
  //   }
  // })
  //   .then(async (res) => await res?.json()) || { username: 'unknown', discriminator: 'unknown', avatar: 'unknown' }

  const title: string = currentIncident.name.length > 256 ? 'Status Page Update' : currentIncident.name
  let description: string
  const fields: Array<{ name: string, value: string, inline?: boolean }> = []

  if (currentIncident.name.length > 256) description += `**${currentIncident.name}}**`

  if (currentIncident.incident_updates.length) {
    fields.push(
      { name: 'Status', value: capitalize(currentIncident.incident_updates[0].status) },
      { name: 'Description', value: currentIncident.incident_updates[0].body }
    )
  } else fields.push({ name: 'Description', value: 'No updates have been published.' })

  return JSON.stringify({
    embeds: [{
      title: title,
      url: currentIncident.shortlink ?? 'https://status.discordapp.com',
      color: getColor(data),
      description,
      fields,
      timestamp: currentIncident.incident_updates[0].created_at,
      author: {
        name: 'Discord Status',
        icon_url: 'https://discord.com/assets/2c21aeda16de354ba5334551a883b481.png',
        url: ops?.supportServer ?? 'https://status.discordapp.com'
      },
      footer: {
        text: `Started: ${moment(currentIncident.started_at).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss')} (PDT) | Updated:`
        // text: `Made by: ${author.username}#${author.discriminator} | Started: ${moment(currentIncident.started_at).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss')} (PDT) | Updated:`,
        // icon_url: `https://cdn.discordapp.com/avatars/${ops.devId}/${author.avatar}.png`
      }
    }]
  })
}

/**
 * Capitalize a word
 * @param {string} word The word to capitalize
 * @returns {string}
 */
export function capitalize (word: string): string {
  return word[0].toUpperCase() + word.slice(1)
}

/**
 * Get the color the embed should be.
 * @param {StatuspageJSON} data - The returned data from the status page
 * @returns {number} - The color code
 */
export function getColor (data: StatuspageJSON): number {
  switch (data.incidents[0].status) {
    case 'resolved':
    case 'completed':
      return 4437377 // green
    case 'in_progress':
    case 'monitoring':
      return 15922754 // yellow
    case 'investigating':
      return 15571250 // orange
    case 'identified':
      return 15816754 // red
    default:
      return 4360181 // light blue
  }
}
