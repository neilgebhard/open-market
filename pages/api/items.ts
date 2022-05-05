import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized request.' })
  }

  if (req.method === 'POST') {
    try {
      const data = req.body

      const item = await prisma.item.create({
        data: { ...data, ownerId: session.user?.id },
      })

      res.status(200).json(item)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['POST'])
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }
}
