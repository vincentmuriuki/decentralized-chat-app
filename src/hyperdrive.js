import Hyperdrive from 'hyperdrive'
import b4a from 'b4a'

export function initiliazeHyperdrive(storagePath = './data/hyperdrive') {
    const drive = new Hyperdrive(storagePath)

    drive.ready().then(() => {
        console.log('Hyperdrive is ready:', b4a.toString(drive.key, 'hex'))
    })

    return drive
}