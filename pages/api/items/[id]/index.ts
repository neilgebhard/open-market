import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
    select: { items: true },
  })

  const { id } = req.query
  if (!user?.items.find((item) => item.id === id)) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method === 'PATCH') {
    try {
      const item = await prisma.item.update({
        where: { id: String(id) },
        data: req.body,
      })

      // Remove image from supabase storage
      if (item.image) {
        const path = item.image.split(`${process.env.SUPABASE_BUCKET}/`)[1]
        await supabase.storage.from(process.env.SUPABASE_BUCKET!).remove([path])
      }

      res.status(200).json(item)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong.' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const item = await prisma.item.delete({
        where: { id: String(id) },
      })
      res.status(200).json(item)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong.' })
    }
  } else {
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }
}
