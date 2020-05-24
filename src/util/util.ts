import { ops } from '../config'
import fetch from 'node-fetch'
import { StatuspageJSON } from '../types'
import moment = require('moment')

/**
 * Generate an embed with statuspage info
 * @param {StatuspageJSON} data - The statuspage data
 * @returns {Promise<string>}
 */
export async function generateEmbed (data: StatuspageJSON): Promise<string> {
  const currentIncident = data.incidents[0]

  const author: { username: string, discriminator: number, avatar: string } = await fetch(`https://discordapp.com/api/users/${ops.devId}`, {
    headers: {
      authorization: `Bot ${ops.token}`
    }
  })
    .then(async (res) => await res?.json()) || { username: 'unknown', discriminator: 'unknown', avatar: 'unknown' }

  const title: string = currentIncident.name.length > 256 ? 'Status Page Update' : currentIncident.name
  const description: string[] = []

  if (currentIncident.name.length > 256) description.push(`**${currentIncident.name}}**`)

  if (currentIncident.incident_updates.length) {
    description.push(
      `**Status**: ${capitalize(currentIncident.incident_updates[0].status)}`,
      `**Info**: ${currentIncident.incident_updates[0].body}`
    )
  } else description.push('No updates have been published.')

  return JSON.stringify({
    embeds: [{
      title: title,
      url: currentIncident.shortlink ?? 'https://status.discordapp.com',
      color: getColor(data),
      description: description.join('\n'),
      timestamp: currentIncident.incident_updates[0].created_at,
      author: {
        name: 'Discord Status',
        icon_url: 'https://discord.com/assets/2c21aeda16de354ba5334551a883b481.png',
        url: ops?.setupUrl ?? 'https://status.discordapp.com'
      },
      footer: {
        text: `Made by: ${author.username}#${author.discriminator} | Started: ${moment(currentIncident.started_at).subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss')} (PDT) | Updated:`,
        icon_url: `https://cdn.discordapp.com/avatars/${ops.devId}/${author.avatar}.png`
      }
    }]
  })
}

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
      return 2096947 // green
    case 'in_progress':
    case 'monitoring':
      return 15922754 // yellow
    case 'investingating':
      return 15571250 // orange
    case 'identified':
      return 15544882 // red
    default:
      return 4360181 // light blue
  }
}
