import DHT from 'hyperdht'

export function initializeHyperDHT() {
    const dht = new DHT()

    dht.ready().then(() => {
        console.log('HyperDHT node is ready')
    })

    return dht
}