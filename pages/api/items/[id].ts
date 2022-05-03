import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'
import { Item } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email },
    select: { items: true },
  })

  const { id } = req.query
  if (!user.items.find((item) => item.id === id)) {
    return res.status(401).json({ message: 'Unauthorized user.' })
  }

  if (req.method === 'PATCH') {
    try {
      const item = await prisma.item.update({
        where: { id },
        data: req.body,
      })
      res.status(200).json(item)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong.' })
    }
  } else {
    res.setHeader('Allow', ['PATCH'])
    res.status(405).json({ message: 'HTTP method not supported.' })
  }
}
