import Hyperbee from 'hyperbee'
import Hypercore from 'hypercore'

export function initializeHyperBee(core) {
    // const core = new Hypercore(storagePath)
    const db = new Hyperbee(core, { keyEncoding: 'utf-8', valueEncoding: 'json' })

    // db.ready().then(() => {
    //     console.log('Hyperbee database is ready')
    // })

    return db
}