import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { owner } = await prisma.item.findUnique({
        where: { id: req.query.id },
        select: { owner: true },
      })
      return res.status(200).json(owner)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong.' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: 'HTTP method not supported.' })
  }
}
