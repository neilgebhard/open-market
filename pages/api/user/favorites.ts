import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ message: 'Not logged in.' })

  const { id } = req.query

  if (req.method === 'GET') {
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: 'HTTP method not allowed.' })
  }
}
