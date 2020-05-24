import { StatuspageJSON, BaseOptions } from './types'
import { EventEmitter } from 'events'
import fetch from 'node-fetch'
import { promises } from 'fs'

export default class extends EventEmitter {
  private readonly defaults: {
    path: './build/data.json'
    interval: 150000
  }

  remote?: StatuspageJSON;
  local?: StatuspageJSON;

  constructor (private readonly options: BaseOptions) {
    super()
  }

  /**
   * Compare local and remote data
   */
  compare (): boolean {
    if (!this.remote) {
      console.error(new Error('There is no remote data stored in memory. Use fetch before using compare'))
      return
    }
    if (!this.local) {
      console.error(new Error('There is no local data stored in memory. Use read before using compare'))
      return
    }
    if (!Object.keys(this.local).includes('components')) this.write()
    return this.local.incidents[0].incident_updates[0].updated_at !== this.remote.incidents[0].incident_updates[0].updated_at
  }

  /**
   * Fetch data from the status page
   */
  async fetch (): Promise<StatuspageJSON> {
    const remote: StatuspageJSON = await fetch(this.options.url)
      .then(async (res) => await res.json())
      .catch(console.error)
    this.remote = remote
    return remote
  }

  /**
   * Read locally saved data
   */
  async read (): Promise<string> {
    const localData = await promises.readFile(this.options.file ?? this.defaults.path, 'utf-8')
    this.local = JSON.parse(localData)
    return localData
  }

  /**
   * Run at a specified interval
   */
  run (): void {
    this.emit('start', { startedAt: new Date() })

    const run = async (): Promise<void> => {
      this.emit('run', { time: new Date() })
      await this.fetch()
      await this.read()

      if (this.compare()) {
        this.write()
        this.emit('update', this.local)
      }
    }

    run()
    setInterval(run, this.options.interval ?? this.defaults.interval)
  }

  /**
   * Write remote data to the local file
   */
  async write (): Promise<void> {
    if (!this.remote) {
      console.error(new Error('There is no remote data saved in memory. Use fetch before using write'))
      return
    }
    this.local = this.remote
    return await promises.writeFile(this.options.file ?? this.defaults.path, JSON.stringify(this.remote, null, 2))
  }
}
