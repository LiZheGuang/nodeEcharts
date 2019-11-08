const fs = require('fs')
const crc32 = require('crc').crc32

function findChunk(buffer, type) {
    let offset = 8


    while (offset < buffer.length) {
        let chunkLength = buffer.readUInt32BE(offset)
        let chunkType = buffer.slice(offset + 4, offset + 8).toString('ascii')

        if (chunkType === type) {
            return buffer.slice(offset, offset + chunkLength + 12)
        }

        offset += 4 + 4 + chunkLength + 4
    }

    throw new Error(`Chunk "${type}" not found`)
}

// const images = process.argv.slice(2).map(path => fs.readFileSync(path))


const images = fs.readdirSync('./image').map(path => {
   return  fs.readFileSync('./image/' + path)
})



const actl = Buffer.alloc(20)
actl.writeUInt32BE(8, 0)                                    // length of chunk
actl.write('acTL', 4)                                       // type of chunk
actl.writeUInt32BE(images.length, 8)                        // number of frames
actl.writeUInt32BE(0, 12)                                   // number of times to loop (0 - infinite)
actl.writeUInt32BE(crc32(actl.slice(4, 16)), 16)            // crc

const frames = images.map((data, idx) => {

    const ihdr = findChunk(data, 'IHDR')

    const fctl = Buffer.alloc(38)
    fctl.writeUInt32BE(26, 0)                                 // length of chunk
    fctl.write('fcTL', 4)                                     // type of chunk
    fctl.writeUInt32BE(idx ? idx * 2 - 1 : 0, 8)              // sequence number
    fctl.writeUInt32BE(ihdr.readUInt32BE(8), 12)              // width
    fctl.writeUInt32BE(ihdr.readUInt32BE(12), 16)             // height
    fctl.writeUInt32BE(0, 20)                                 // x offset
    fctl.writeUInt32BE(0, 24)                                 // y offset
    fctl.writeUInt16BE(1, 28)                                 // frame delay - fraction numerator
    fctl.writeUInt16BE(1, 30)                                 // frame delay - fraction denominator
    fctl.writeUInt8(0, 32)                                    // dispose mode
    fctl.writeUInt8(0, 33)                                    // blend mode
    fctl.writeUInt32BE(crc32(fctl.slice(4, 34)), 34)          // crc

    const idat = findChunk(data, 'IDAT')

    // All IDAT chunks except first one are converted to fdAT chunks
    let fdat;

    if (idx === 0) {
        fdat = idat
    } else {
        let length = idat.length + 4

        fdat = Buffer.alloc(length)

        fdat.writeUInt32BE(length - 12, 0)                      // length of chunk
        fdat.write('fdAT', 4)                                   // type of chunk
        fdat.writeUInt32BE(idx * 2, 8)                          // sequence number
        idat.copy(fdat, 12, 8)    
        
        // let s = crc32(4, length - 4)
        // image data
        fdat.writeUInt32BE(fdat,length - 4)    // crc
    }

    return Buffer.concat([fctl, fdat])
})

const signature = Buffer.from('\211PNG\r\n\032\n', 'ascii')
const ihdr = findChunk(images[0], 'IHDR')
const iend = Buffer.from('0000000049454e44ae426082', 'hex')

const output = Buffer.concat([signature, ihdr, actl, ...frames, iend])

fs.writeFileSync('output.png', output)