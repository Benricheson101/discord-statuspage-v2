/* eslint @typescript-eslint/camelcase: 0  */
import { PathLike } from 'fs'
import { MongoClientOptions } from 'mongodb'

export interface DatabaseOps {
  connectionURI: string
  name: string
  options?: MongoClientOptions
}

export interface DatabaseWebhook {
  _id: any
  guild_id: string
  channel_id: string
  id: string
  token: string
}

export interface BaseOptions {
  /** The statuspage.io URL */
  url: string
  /** Where to save the data */
  file?: PathLike
  /** The interval to make a request to the status page (ms) */
  interval?: number
}

export interface StatuspageJSON {
  page: {
    id: string
    name: string
    url: string
  }
  status: {
    indicator: string
    description: string
  }
  components: component[]
  incidents: incident[]

  [key: string]: any
}

export interface component {
  status: string
  name: string
  created_at: string
  updated_at: string
  position: number
  showcase: boolean
  description: string
  id: string
  page_id: string
  grup_id: unknown

  [key: string]: any
}

export interface incident {
  name: string
  status: string
  created_at: string
  updated_at: string
  monitoring_at: string
  resolving_at?: string
  resolved_at?: string
  impact?: string
  shortlink: string
  scheduled_for?: string
  scheduled_until?: string
  scheduled_remind_prior?: boolean
  scheduled_reminded_at?: string
  scheduled_auto_in_progress?: boolean
  scheduled_auto_completed?: boolean
  metadata?: any
  started_at: string
  id: string
  page_id: string
  incident_updates: incident_update[]
  postmortem_body?: string
  postmortem_body_last_updated_at?: string
  postmortem_ignored?: boolean
  postmortem_published_at?: string
  postmortem_notified_subscribers?: boolean
  postmortem_notified_twitter?: boolean
  components: any[]

  [key: string]: any
}

export interface incident_update {
  status: 'investigating' | string
  body?: string
  created_at: string
  wants_twitter_update: boolean
  twitter_updated_at?: string
  updated_at: string
  display_at: string
  affected_components?: any
  deliver_notifications: boolean
  tweet_id?: string
  id: string
  incident_update: string
  custom_tweet: any
}

export interface IncomingWebhook {
  webhook: {
    type: number
    id: string
    name: string
    avatar: string
    channel_id: string
    guild_id: string
    token: string
    url: string
  }
}
