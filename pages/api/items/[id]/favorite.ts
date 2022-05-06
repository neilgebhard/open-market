import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ message: 'Not logged in.' })

  const { id: itemId } = req.query

  if (req.method === 'PUT') {
    try {
      const item = await prisma.item.update({
        where: { id: itemId as string },
        data: {
          favoritedBy: { connect: { id: session.user?.id } },
        },
        include: {
          favoritedBy: true,
        },
      })
      return res.status(200).json(item)
    } catch (e) {
      return res.status(500).json({ message: 'Something went wrong' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const item = await prisma.item.update({
        where: { id: itemId as string },
        data: {
          favoritedBy: { disconnect: { id: session.user?.id } },
        },
        include: { favoritedBy: true },
      })
      return res.status(200).json(item)
    } catch (e) {
      return res.status(500).json({ message: 'Something went wrong' })
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).json({ message: 'HTTP method not allowed.' })
  }
}
