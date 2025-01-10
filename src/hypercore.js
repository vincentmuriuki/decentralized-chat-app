import Hypercore from 'hypercore'
import b4a from 'b4a'
import path from 'bare-path'
import ram from 'random-access-memory';

export function initializeHypercore(storagePath) {
    const feed = new Hypercore(storagePath, { valueEncoding: 'json' })
    return feed
}
