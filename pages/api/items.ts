import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized request.' })
  }

  if (req.method === 'POST') {
    try {
      const { image, name, description, price } = req.body

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })

      const item = await prisma.item.create({
        data: { image, name, description, price, ownerId: user.id },
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
