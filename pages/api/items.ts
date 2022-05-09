import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// POST /api/items
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' })
  }

  if (req.method === 'POST') {
    try {
      const data = req.body

      const item = await prisma.item.create({
        data: {
          ...data,
          owner: { connect: { email: session?.user?.email } },
        },
      })

      res.status(200).json(item)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  } else {
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }
}
