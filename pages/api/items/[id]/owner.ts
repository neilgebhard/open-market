import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const data = await prisma.item.findUnique({
        where: { id: req.query.id as string },
        select: { owner: true },
      })
      return res.status(200).json(data?.owner)
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong.' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: 'HTTP method not supported.' })
  }
}
