import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  if (!session) return res.status(401).json({ message: 'Not logged in.' })

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
      select: { favoriteItems: true },
    })
    res.status(200).json(user?.favoriteItems?.map((f) => f.id))
  } else {
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` })
  }
}
