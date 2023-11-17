import fs from 'fs'
import { once } from 'events'
export default async (options) => {
  const stream = fs.createWriteStream(options.destination)
  await once(stream, 'open')
  return stream
}