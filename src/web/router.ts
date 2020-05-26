import { readFile } from 'fs'
import { IncomingMessage, ServerResponse } from 'http'

export const router = {
  checkRoute (url: string, req: IncomingMessage, res: ServerResponse) {
    switch (url) {
      case ('/'): {
        readFile('build/web/pages/index.html', (err: Error, data: Buffer) => {
          if (err) throw err
          res.end(data)
        })
        break
      }
      case ('/authorized'): {
        readFile('build/web/pages/authorized.html', (err: Error, data: Buffer) => {
          if (err) throw err
          res.end(data)
        })
        break
      }
      case ('/login'): {
        readFile('build/web/pages/login.html', (err: Error, data: Buffer) => {
          if (err) throw err
          res.end(data)
        })
        break
      }
      case ('/error'): {
        readFile('build/web/pages/error.html', (err: Error, data: Buffer) => {
          if (err) throw err
          res.end(data)
        })
        break
      }
      default: {
        res.end('An error occurred.')
      }
    }
  }
}
