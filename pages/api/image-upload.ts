import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'
import { decode } from 'base64-arraybuffer'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { image } = req.body

    if (!image) {
      return res.status(500).json({ message: 'Image must be provided.' })
    }

    try {
      // Image must be base64
      const contentType = image.match(/data:(.*);base64/)?.[1]
      const base64FileData = image.split('base64,')?.[1]

      if (!contentType || !base64FileData) {
        return res.status(500).json({ message: 'Image data not valid.' })
      }

      // Generate a unique filename
      const fileName = nanoid()
      const ext = contentType.split('/')[1]
      const path = `${fileName}.${ext}`

      // upload file to Supabase bucket
      const { data, error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET!)
        .upload(path, decode(base64FileData), { contentType, upsert: true })

      console.log(data, uploadError)

      if (uploadError) {
        throw new Error('Unable to upload image to storage.')
      }

      // Construct public URL
      const url = `${process.env.SUPABASE_URL!.replace(
        '.co',
        '.in'
      )}/storage/v1/object/public/${data?.Key}`

      console.log(url)

      res.status(200).json({ url })
    } catch (e) {
      res
        .status(500)
        .json({ message: 'Something went wrong with image upload.' })
    }
  } else {
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }
}
