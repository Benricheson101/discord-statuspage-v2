import { connect, MongoClient, Db, InsertOneWriteOpResult, DeleteWriteOpResultObject } from 'mongodb'
import { DatabaseWebhook, DatabaseOps } from '../types'

export default class Database {
  public db: Db
  public client: MongoClient
  public connected: boolean = false

  constructor (public readonly opts: DatabaseOps) {
  }

  async addWebhook (webhook: DatabaseWebhook): Promise<InsertOneWriteOpResult<DatabaseWebhook>> {
    return await this.db.collection('webhooks').insertOne(webhook)
  }

  async deleteWebhook (id: string, token: string): Promise<DeleteWriteOpResultObject> {
    return await this.db.collection('webhooks').deleteOne({ id: id, token: token })
  }

  async getWebhooks (): Promise<DatabaseWebhook[]> {
    return await this.db.collection('webhooks').find().toArray()
  }

  async connect (): Promise<void> {
    const mongo = await connect(this.opts.connectionURI, this.opts.options)
      .catch(console.error)

    if (mongo instanceof MongoClient) {
      this.db = mongo.db(this.opts.name)
      this.client = mongo
      this.connected = true
    }
  }
}
